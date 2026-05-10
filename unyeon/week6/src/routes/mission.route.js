import express from 'express'
import { handleChallengeMission } from '../controllers/mission.controller.js'

export const missionRouter = express.Router()

// 4. POST /api/v1/missions/:missionId/challenges  (미션 도전하기)
missionRouter.post('/:missionId/challenges', handleChallengeMission)
