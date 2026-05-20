import express from 'express'
import {
  handleMemberSignUp,
  handleGetMyReviews,
  handleGetMyMissions,
  handleCompleteMission,
} from '../controllers/member.controller.js'

export const memberRouter = express.Router()

// POST  /api/v1/members                                    (회원가입)
memberRouter.post('/', handleMemberSignUp)

// GET   /api/v1/members/:memberId/reviews                  (내가 작성한 리뷰 목록)
memberRouter.get('/:memberId/reviews', handleGetMyReviews)

// GET   /api/v1/members/:memberId/missions                 (내가 진행 중인 미션 목록)
memberRouter.get('/:memberId/missions', handleGetMyMissions)

// PATCH /api/v1/members/:memberId/missions/:missionId/complete (미션 완료 처리)
memberRouter.patch('/:memberId/missions/:missionId/complete', handleCompleteMission)
