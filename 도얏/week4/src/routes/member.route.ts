import express from 'express'
import { memberController } from '../controllers/member.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const memberRouter = express.Router()

memberRouter.post('/', memberController.signUp)
memberRouter.post('/login', memberController.login)
memberRouter.get('/me', authMiddleware, memberController.getMyPage)
memberRouter.get('/me/missions', authMiddleware, memberController.getMyMissions)
