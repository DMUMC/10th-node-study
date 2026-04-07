import { missionRepository } from '../repositories/mission.repository.js'

export const missionService = {
  challengeMission: (missionId, memberId) => {
    // TODO: DB 연동 후 실제 로직 구현
    return { missionId, status: 'CHALLENGING', createdAt: new Date().toISOString() }
  }
}
