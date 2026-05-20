import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { MissionCreateRequest, MissionChallengeRequest } from '../dtos/mission.dto.js'
import { createMission, challengeMission } from '../services/mission.service.js'

// POST /api/v1/stores/:storeId/missions
export const handleCreateMission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const storeId = parseInt(req.params['storeId'] ?? '0', 10)
    const result = await createMission(storeId, req.body as MissionCreateRequest)
    res.status(StatusCodes.CREATED).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/missions/:missionId/challenge
export const handleChallengeMission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const missionId = parseInt(req.params['missionId'] ?? '0', 10)
    const result = await challengeMission(missionId, req.body as MissionChallengeRequest)
    res.status(StatusCodes.CREATED).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}
