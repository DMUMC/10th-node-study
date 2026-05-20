import { missionRepository } from '../repositories/mission.repository.js'
import type { MemberMission } from '../types/index.js'

const makeError = (message: string, status: number): Error & { status: number } => {
  const err = new Error(message) as Error & { status: number }
  err.status = status
  return err
}

export const missionService = {
  challengeMission: (missionId: number, memberId: number): MemberMission => {
    const mission = missionRepository.findById(missionId)
    if (!mission) {
      throw makeError('존재하지 않는 미션입니다.', 404)
    }

    const existing = missionRepository.findMemberMission(memberId, missionId)
    if (existing) {
      throw makeError('이미 도전 중이거나 완료한 미션입니다.', 409)
    }

    return missionRepository.saveMemberMission({ memberId, missionId, status: 'CHALLENGING' })
  },
}
