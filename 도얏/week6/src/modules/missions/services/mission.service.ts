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

const makeError = (message: string, status: number): Error & { status: number } => {
  const err = new Error(message) as Error & { status: number }
  err.status = status
  return err
}

// 미션 추가
export const createMission = async (storeId: number, data: MissionCreateRequest) => {
  // 가게 존재 여부 검증
  const store = await getStoreById(storeId)
  if (!store) {
    throw makeError('존재하지 않는 가게입니다.', 404)
  }

  const missionData = bodyToMission(data)
  const missionId = await addMission({ ...missionData, storeId })

  const mission = await getMissionById(missionId)
  if (!mission) {
    throw makeError('미션 생성 후 조회에 실패했습니다.', 500)
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

// 특정 가게의 미션 목록
export const listStoreMissions = async (storeId: number, cursor: number) => {
  const missions = await getStoreMissions(storeId, cursor)
  const last = missions[missions.length - 1]
  return {
    data: missions,
    pagination: { cursor: last ? last.id : null },
  }
}

// 내가 진행 중인 미션 목록
export const listOngoingMissions = async (userId: number, cursor: number) => {
  const missions = await getOngoingMissions(userId, cursor)
  const last = missions[missions.length - 1]
  return {
    data: missions,
    pagination: { cursor: last ? last.id : null },
  }
}

// 진행 중인 미션을 완료로 변경
export const finishMission = async (userId: number, missionId: number) => {
  const result = await completeMission(userId, missionId)
  if (result.count === 0) {
    throw makeError('진행 중인 미션이 없습니다.', 404)
  }
  return { message: '미션이 완료 처리됐습니다.' }
}

// 미션 도전하기
export const challengeMission = async (
  missionId: number,
  data: MissionChallengeRequest,
) => {
  // 미션 존재 여부 검증
  const mission = await getMissionById(missionId)
  if (!mission) {
    throw makeError('존재하지 않는 미션입니다.', 404)
  }

  // 필수값 검증
  if (!data.status) {
    throw makeError('status는 필수 입력값입니다. (CHALLENGING 또는 COMPLETE)', 400)
  }

  // 이미 도전 중인지 검증
  const existing = await findMemberMission(data.memberId, missionId)
  if (existing) {
    throw makeError('이미 도전 중인 미션입니다.', 409)
  }

  const memberMissionId = await addMemberMission(data.memberId, missionId, data.status)

  const memberMission = await getMemberMissionById(memberMissionId)
  if (!memberMission) {
    throw makeError('미션 도전 후 조회에 실패했습니다.', 500)
  }

  return responseFromMemberMission(memberMission as unknown as {
    id: number
    member_id: number
    mission_id: number
    status: string
  })
}
