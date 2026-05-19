import { StatusCodes } from 'http-status-codes'
import { bodyToSignUp } from '../dtos/member.dto.js'
import {
  memberSignUp,
  getMyReviews,
  getMyChallengingMissions,
  finishMission,
} from '../services/member.service.js'

// 회원가입 (비밀번호 해싱 포함)
export const handleMemberSignUp = async (req, res, next) => {
  try {
    const result = await memberSignUp(bodyToSignUp(req.body))
    res.status(StatusCodes.CREATED).success(result)
  } catch (err) {
    next(err)
  }
}

// 내가 작성한 리뷰 목록 GET /api/v1/members/:memberId/reviews
export const handleGetMyReviews = async (req, res, next) => {
  try {
    const memberId = Number(req.params.memberId)
    const cursor = req.query.cursor ? Number(req.query.cursor) : null
    const result = await getMyReviews(memberId, cursor)
    res.success(result)
  } catch (err) {
    next(err)
  }
}

// 내가 진행 중인 미션 목록 GET /api/v1/members/:memberId/missions
export const handleGetMyMissions = async (req, res, next) => {
  try {
    const memberId = Number(req.params.memberId)
    const page = req.query.page ? Number(req.query.page) : 1
    const result = await getMyChallengingMissions(memberId, page)
    res.success(result)
  } catch (err) {
    next(err)
  }
}

// 진행 중인 미션 → 완료 처리 PATCH /api/v1/members/:memberId/missions/:missionId/complete
export const handleCompleteMission = async (req, res, next) => {
  try {
    const { memberId, missionId } = req.params
    const result = await finishMission(memberId, missionId)
    res.success(result)
  } catch (err) {
    next(err)
  }
}
