import express from 'express'
import { handleChallengeMission } from '../controllers/mission.controller.js'
import { isLogin } from '../middlewares/auth.middleware.js'

export const missionRouter = express.Router()

// POST /api/v1/missions/:missionId/challenges  (미션 도전하기 - 로그인 필요)
missionRouter.post('/:missionId/challenges', isLogin, handleChallengeMission)
