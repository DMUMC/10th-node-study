import { missionService } from '../services/mission.service.js'

export const missionController = {
  challengeMission: (req, res) => {
    const { missionId } = req.params
    const result = missionService.challengeMission(missionId, 1) // TODO: 토큰에서 memberId 추출
    res.status(201).json({ success: true, code: 'S201', message: '미션 도전이 시작되었습니다.', data: result })
  }
}
