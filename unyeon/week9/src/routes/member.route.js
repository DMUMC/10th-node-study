import express from 'express'
import {
  handleMemberSignUp,
  handleMemberLogin,
  handleGetMyReviews,
  handleGetMyMissions,
  handleCompleteMission,
  handleUpdateMember,
} from '../controllers/member.controller.js'
import { isLogin } from '../middlewares/auth.middleware.js'

export const memberRouter = express.Router()

// POST  /api/v1/members          (회원가입)
memberRouter.post('/', handleMemberSignUp)

// POST  /api/v1/members/login    (로그인 → JWT 발급)
memberRouter.post('/login', handleMemberLogin)

// PATCH /api/v1/members/:memberId  (회원 정보 수정)
memberRouter.patch('/:memberId', isLogin, handleUpdateMember)

// GET   /api/v1/members/:memberId/reviews    (내가 작성한 리뷰 목록)
memberRouter.get('/:memberId/reviews', isLogin, handleGetMyReviews)

// GET   /api/v1/members/:memberId/missions   (내가 진행 중인 미션 목록)
memberRouter.get('/:memberId/missions', isLogin, handleGetMyMissions)

// PATCH /api/v1/members/:memberId/missions/:missionId/complete (미션 완료 처리)
memberRouter.patch('/:memberId/missions/:missionId/complete', isLogin, handleCompleteMission)
