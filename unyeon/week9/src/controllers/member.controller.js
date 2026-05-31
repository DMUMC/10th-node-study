import { StatusCodes } from 'http-status-codes'
import { bodyToSignUp } from '../dtos/member.dto.js'
import {
  memberSignUp,
  memberLogin,
  getMyReviews,
  getMyChallengingMissions,
  finishMission,
  updateMemberInfo,
} from '../services/member.service.js'

// 회원가입
export const handleMemberSignUp = async (req, res, next) => {
  /*
    #swagger.tags = ['Members']
    #swagger.summary = '회원가입 API'
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: { type: "object", properties: {
        email: { type: "string", example: "unyeon@umc.com" },
        password: { type: "string", example: "password123" },
        name: { type: "string", example: "언년" },
        nickname: { type: "string", example: "unyeon" },
        gender: { type: "string", example: "FEMALE" },
        birth: { type: "string", example: "2000-01-01" },
        address: { type: "string", example: "서울시 강남구" },
        phoneNumber: { type: "string", example: "010-1234-5678" }
      }}}}
    }
    #swagger.responses[201] = { description: "회원가입 성공" }
    #swagger.responses[409] = { description: "이미 존재하는 이메일" }
  */
  try {
    const result = await memberSignUp(bodyToSignUp(req.body))
    res.status(StatusCodes.CREATED).success(result)
  } catch (err) {
    next(err)
  }
}

// 로그인 → JWT 발급
export const handleMemberLogin = async (req, res, next) => {
  /*
    #swagger.tags = ['Members']
    #swagger.summary = '로그인 API (JWT 발급)'
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: { type: "object", properties: {
        email: { type: "string", example: "unyeon@umc.com" },
        password: { type: "string", example: "password123" }
      }}}}
    }
    #swagger.responses[200] = { description: "로그인 성공 - accessToken 반환" }
    #swagger.responses[400] = { description: "이메일 또는 비밀번호 불일치" }
  */
  try {
    const result = await memberLogin(req.body)
    res.success(result)
  } catch (err) {
    next(err)
  }
}

// 내가 작성한 리뷰 목록 GET /api/v1/members/:memberId/reviews
export const handleGetMyReviews = async (req, res, next) => {
  /*
    #swagger.tags = ['Members']
    #swagger.summary = '내 리뷰 목록 조회 API'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: "리뷰 목록 조회 성공" }
  */
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
  /*
    #swagger.tags = ['Members']
    #swagger.summary = '내 도전 중인 미션 목록 조회 API'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: "미션 목록 조회 성공" }
  */
  try {
    const memberId = Number(req.params.memberId)
    const page = req.query.page ? Number(req.query.page) : 1
    const result = await getMyChallengingMissions(memberId, page)
    res.success(result)
  } catch (err) {
    next(err)
  }
}

// 진행 중인 미션 → 완료 처리
export const handleCompleteMission = async (req, res, next) => {
  /*
    #swagger.tags = ['Members']
    #swagger.summary = '미션 완료 처리 API'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: "미션 완료 성공" }
    #swagger.responses[400] = { description: "이미 완료된 미션" }
  */
  try {
    const { memberId, missionId } = req.params
    const result = await finishMission(memberId, missionId)
    res.success(result)
  } catch (err) {
    next(err)
  }
}

// 회원 정보 수정 PATCH /api/v1/members/:memberId
export const handleUpdateMember = async (req, res, next) => {
  /*
    #swagger.tags = ['Members']
    #swagger.summary = '회원 정보 수정 API'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: { type: "object", properties: {
        name: { type: "string", example: "언년" },
        address: { type: "string", example: "서울시 마포구" },
        phoneNumber: { type: "string", example: "010-9876-5432" }
      }}}}
    }
    #swagger.responses[200] = { description: "회원 정보 수정 성공" }
    #swagger.responses[404] = { description: "회원을 찾을 수 없음" }
  */
  try {
    const { memberId } = req.params
    const result = await updateMemberInfo(memberId, req.body)
    res.success(result)
  } catch (err) {
    next(err)
  }
}
