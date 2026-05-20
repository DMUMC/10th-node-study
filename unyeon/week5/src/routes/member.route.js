import express from 'express'
import { handleMemberSignUp } from '../controllers/member.controller.js'

export const memberRouter = express.Router()

// POST /api/v1/members  (회원가입)
memberRouter.post('/', handleMemberSignUp)
