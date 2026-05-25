import {
  MissionCreateRequest,
  MissionChallengeRequest,
  bodyToMission,
  responseFromMission,
  responseFromMemberMission,
} from '../dtos/mission.dto.js'
import {
  addMission,
  getMissionById,
  findMemberMission,
  addMemberMission,
  getMemberMissionById,
  getStoreMissions,
  getOngoingMissions,
  completeMission,
} from '../repositories/mission.repository.js'
import { getStoreById } from '../../stores/repositories/store.repository.js'
import { BaseError } from '../../../utils/errors.js'
import { ErrorCode } from '../../../utils/errorCode.js'

export const createMission = async (storeId: number, data: MissionCreateRequest) => {
  const store = await getStoreById(storeId)
  if (!store) {
    throw new BaseError(
      ErrorCode.STORE_NOT_FOUND.message,
      ErrorCode.STORE_NOT_FOUND.status,
      ErrorCode.STORE_NOT_FOUND.code,
    )
  }

  const missionData = bodyToMission(data)
  const missionId = await addMission({ ...missionData, storeId })

  const mission = await getMissionById(missionId)
  if (!mission) {
    throw new BaseError(
      ErrorCode.MISSION_CREATE_FAILED.message,
      ErrorCode.MISSION_CREATE_FAILED.status,
      ErrorCode.MISSION_CREATE_FAILED.code,
    )
  }

  return responseFromMission(mission as unknown as {
    id: number
    store_id: number
    title: string
    reward: number
    spec: string | null
    dead_line: Date | null
  })
}

export const listStoreMissions = async (storeId: number, cursor: number) => {
  const missions = await getStoreMissions(storeId, cursor)
  const last = missions[missions.length - 1]
  return {
    data: missions,
    pagination: { cursor: last ? last.id : null },
  }
}

export const listOngoingMissions = async (userId: number, cursor: number) => {
  const missions = await getOngoingMissions(userId, cursor)
  const last = missions[missions.length - 1]
  return {
    data: missions,
    pagination: { cursor: last ? last.id : null },
  }
}

export const finishMission = async (userId: number, missionId: number) => {
  const result = await completeMission(userId, missionId)
  if (result.count === 0) {
    throw new BaseError(
      ErrorCode.ONGOING_MISSION_NOT_FOUND.message,
      ErrorCode.ONGOING_MISSION_NOT_FOUND.status,
      ErrorCode.ONGOING_MISSION_NOT_FOUND.code,
    )
  }
  return { message: '미션이 완료 처리됐습니다.' }
}

// userId는 JWT에서 추출한 값 (body.memberId 제거)
export const challengeMission = async (missionId: number, userId: number, data: MissionChallengeRequest) => {
  const mission = await getMissionById(missionId)
  if (!mission) {
    throw new BaseError(
      ErrorCode.MISSION_NOT_FOUND.message,
      ErrorCode.MISSION_NOT_FOUND.status,
      ErrorCode.MISSION_NOT_FOUND.code,
    )
  }

  if (!data.status) {
    throw new BaseError(
      ErrorCode.MISSION_STATUS_REQUIRED.message,
      ErrorCode.MISSION_STATUS_REQUIRED.status,
      ErrorCode.MISSION_STATUS_REQUIRED.code,
    )
  }

  const existing = await findMemberMission(userId, missionId)
  if (existing) {
    throw new BaseError(
      ErrorCode.MISSION_ALREADY_CHALLENGING.message,
      ErrorCode.MISSION_ALREADY_CHALLENGING.status,
      ErrorCode.MISSION_ALREADY_CHALLENGING.code,
    )
  }

  const memberMissionId = await addMemberMission(userId, missionId, data.status)

  const memberMission = await getMemberMissionById(memberMissionId)
  if (!memberMission) {
    throw new BaseError(
      ErrorCode.MISSION_CHALLENGE_FAILED.message,
      ErrorCode.MISSION_CHALLENGE_FAILED.status,
      ErrorCode.MISSION_CHALLENGE_FAILED.code,
    )
  }

  return responseFromMemberMission(memberMission as unknown as {
    id: number
    member_id: number
    mission_id: number
    status: string
  })
}
