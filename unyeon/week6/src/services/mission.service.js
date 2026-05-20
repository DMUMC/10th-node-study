import { existsStore } from '../repositories/store.repository.js'
import {
  addMission,
  addMemberMission,
  existsMission,
  existsMemberMission,
  getMissionById,
} from '../repositories/mission.repository.js'
import {
  responseFromMission,
  responseFromMemberMission,
} from '../dtos/mission.dto.js'
import { getMemberById } from '../repositories/member.repository.js'
import {
  StoreNotFoundError,
  MissionNotFoundError,
  MemberNotFoundError,
  AlreadyChallengingError,
  BadRequestError,
} from '../errors.js'

// 3. 가게에 미션 추가
export const createMission = async (data) => {
  if (!data.title) {
    throw new BadRequestError('미션 제목은 필수입니다.')
  }

  // 가게 존재 검증
  const storeExists = await existsStore(data.storeId)
  if (!storeExists) {
    throw new StoreNotFoundError(data.storeId)
  }

  const newMissionId = await addMission(data)
  const newMission = await getMissionById(newMissionId)
  return responseFromMission(newMission)
}

// 4. 미션 도전하기 (필수 API)
export const challengeMission = async ({ memberId, missionId }) => {
  // 회원 존재 검증
  const member = await getMemberById(memberId)
  if (!member) {
    throw new MemberNotFoundError(memberId)
  }

  // 미션 존재 검증
  const missionExists = await existsMission(missionId)
  if (!missionExists) {
    throw new MissionNotFoundError(missionId)
  }

  // 이미 도전 중인지 검증
  const alreadyChallenging = await existsMemberMission(memberId, missionId)
  if (alreadyChallenging) {
    throw new AlreadyChallengingError(memberId, missionId)
  }

  const newMemberMission = await addMemberMission(memberId, missionId)
  return responseFromMemberMission(newMemberMission)
}
