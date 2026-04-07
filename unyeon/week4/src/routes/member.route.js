import express from 'express'
import { memberController } from '../controllers/member.controller.js'

export const memberRouter = express.Router()

memberRouter.post('/', memberController.signUp)
memberRouter.get('/me', memberController.getMyPage)
memberRouter.get('/me/missions', memberController.getMyMissions)
