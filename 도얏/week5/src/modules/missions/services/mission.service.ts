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
} from '../repositories/mission.repository.js'
import { findStoreById } from '../../stores/repositories/store.repository.js'

const makeError = (message: string, status: number): Error & { status: number } => {
  const err = new Error(message) as Error & { status: number }
  err.status = status
  return err
}

// 미션 추가
export const createMission = async (storeId: number, data: MissionCreateRequest) => {
  // 가게 존재 여부 검증
  const store = await findStoreById(storeId)
  if (!store) {
    throw makeError('존재하지 않는 가게입니다.', 404)
  }

  const missionData = bodyToMission(data)
  const missionId = await addMission({ ...missionData, storeId })

  const mission = await getMissionById(missionId)
  if (!mission) {
    throw makeError('미션 생성 후 조회에 실패했습니다.', 500)
  }

  return responseFromMission(mission as {
    id: number
    store_id: number
    title: string
    reward: number
    spec: string | null
    dead_line: Date | null
  })
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

  // 이미 도전 중인지 검증
  const existing = await findMemberMission(data.memberId, missionId)
  if (existing) {
    throw makeError('이미 도전 중인 미션입니다.', 409)
  }

  const memberMissionId = await addMemberMission(data.memberId, missionId)

  const memberMission = await getMemberMissionById(memberMissionId)
  if (!memberMission) {
    throw makeError('미션 도전 후 조회에 실패했습니다.', 500)
  }

  return responseFromMemberMission(memberMission as {
    id: number
    member_id: number
    mission_id: number
    status: string
  })
}
