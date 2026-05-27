import {
  MissionChallengeRequest,
  MissionCreateRequest,
  MissionStatus,
  bodyToMission,
  responseFromMemberMission,
  responseFromMission,
} from '../dtos/missionDto.js'
import {
  addMemberMission,
  addMission,
  completeMission,
  findMemberMission,
  getMemberMissionById,
  getMemberMissionByMemberAndMission,
  getMissionById,
  getOngoingMissions,
  getStoreMissions,
} from '../repositories/missionRepository.js'
import { getUser } from '../../members/repositories/memberRepository.js'
import { getStoreById } from '../../stores/repositories/storeRepository.js'
import { BaseError } from '../../../utils/errors.js'
import { ErrorCode } from '../../../utils/errorCode.js'

export const createMission = async (storeId: number, data: MissionCreateRequest) => {
  const store = await getStoreById(storeId)
  if (!store) {
    throw new BaseError(ErrorCode.STORE_NOT_FOUND)
  }

  const missionData = bodyToMission(data)
  const missionId = await addMission({ ...missionData, storeId })
  const mission = await getMissionById(missionId)

  if (!mission) {
    throw new BaseError(ErrorCode.MISSION_CREATE_FAILED)
  }

  return responseFromMission(mission)
}

export const listStoreMissions = async (storeId: number, cursor: number) => {
  const store = await getStoreById(storeId)
  if (!store) {
    throw new BaseError(ErrorCode.STORE_NOT_FOUND)
  }

  const missions = await getStoreMissions(storeId, cursor)
  const last = missions[missions.length - 1]
  return {
    data: missions.map(responseFromMission),
    pagination: { cursor: last ? last.id : null },
  }
}

export const listOngoingMissions = async (userId: number, cursor: number) => {
  const user = await getUser(userId)
  if (!user) {
    throw new BaseError(ErrorCode.USER_NOT_FOUND)
  }

  const missions = await getOngoingMissions(userId, cursor)
  const last = missions[missions.length - 1]
  return {
    data: missions.map(responseFromMemberMission),
    pagination: { cursor: last ? last.id : null },
  }
}

export const finishMission = async (userId: number, missionId: number) => {
  const user = await getUser(userId)
  if (!user) {
    throw new BaseError(ErrorCode.USER_NOT_FOUND)
  }

  const result = await completeMission(userId, missionId)
  if (result.count === 0) {
    throw new BaseError(ErrorCode.ONGOING_MISSION_NOT_FOUND)
  }

  const memberMission = await getMemberMissionByMemberAndMission(userId, missionId)
  if (!memberMission) {
    throw new BaseError(ErrorCode.ONGOING_MISSION_NOT_FOUND)
  }

  return responseFromMemberMission(memberMission)
}

export const challengeMission = async (missionId: number, data: MissionChallengeRequest) => {
  const mission = await getMissionById(missionId)
  if (!mission) {
    throw new BaseError(ErrorCode.MISSION_NOT_FOUND)
  }

  const user = await getUser(data.memberId)
  if (!user) {
    throw new BaseError(ErrorCode.USER_NOT_FOUND)
  }

  const status = data.status ?? MissionStatus.CHALLENGING
  if (!Object.values(MissionStatus).includes(status)) {
    throw new BaseError(ErrorCode.MISSION_STATUS_REQUIRED)
  }

  const existing = await findMemberMission(data.memberId, missionId)
  if (existing) {
    throw new BaseError(ErrorCode.MISSION_ALREADY_CHALLENGING)
  }

  const memberMissionId = await addMemberMission(data.memberId, missionId, status)
  const memberMission = await getMemberMissionById(memberMissionId)

  if (!memberMission) {
    throw new BaseError(ErrorCode.MISSION_CHALLENGE_FAILED)
  }

  return responseFromMemberMission(memberMission)
}
