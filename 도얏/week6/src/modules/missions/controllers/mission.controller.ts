import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { MissionCreateRequest, MissionChallengeRequest } from '../dtos/mission.dto.js'
import { createMission, challengeMission, listStoreMissions, listOngoingMissions, finishMission } from '../services/mission.service.js'

// GET /api/v1/users/:userId/missions
export const handleListOngoingMissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(String(req.params['userId'] ?? '0'), 10)
    const cursor = typeof req.query['cursor'] === 'string' ? parseInt(req.query['cursor'], 10) : 0
    res.status(200).json(await listOngoingMissions(userId, cursor))
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/stores/:storeId/missions
export const handleListStoreMissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = parseInt(String(req.params['storeId'] ?? '0'), 10)
    const cursor = typeof req.query['cursor'] === 'string' ? parseInt(req.query['cursor'], 10) : 0
    res.status(200).json(await listStoreMissions(storeId, cursor))
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/stores/:storeId/missions
export const handleCreateMission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const storeId = parseInt(String(req.params['storeId'] ?? '0'), 10)
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
    const missionId = parseInt(String(req.params['missionId'] ?? '0'), 10)
    const result = await challengeMission(missionId, req.body as MissionChallengeRequest)
    res.status(StatusCodes.CREATED).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/v1/users/:userId/missions/:missionId
export const handleCompleteMission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(String(req.params['userId'] ?? '0'), 10)
    const missionId = parseInt(String(req.params['missionId'] ?? '0'), 10)
    res.status(200).json(await finishMission(userId, missionId))
  } catch (err) {
    next(err)
  }
}
