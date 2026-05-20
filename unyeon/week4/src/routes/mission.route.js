import express from 'express'
import { missionController } from '../controllers/mission.controller.js'

export const missionRouter = express.Router()

missionRouter.post('/:missionId/challenges', missionController.challengeMission)
