import express from 'express'
import { missionController } from '../controllers/mission.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const missionRouter = express.Router()

missionRouter.post('/:missionId/challenges', authMiddleware, missionController.challengeMission)
