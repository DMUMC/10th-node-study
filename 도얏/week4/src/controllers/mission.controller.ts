import { Request, Response, NextFunction } from 'express'
import { missionService } from '../services/mission.service.js'

export const missionController = {
  challengeMission: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const missionId = parseInt(String(req.params.missionId), 10)
      const result = missionService.challengeMission(missionId, req.memberId!)
      res.status(201).json({ success: true, code: 'S201', message: '미션 도전이 시작되었습니다.', data: result })
    } catch (e) {
      next(e)
    }
  },
}
