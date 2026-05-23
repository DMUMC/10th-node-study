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
  /*
    #swagger.tags = ['Members']
    #swagger.summary = '회원가입 API'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", example: "unyeon@umc.com" },
              password: { type: "string", example: "password123" },
              name: { type: "string", example: "언년" },
              gender: { type: "string", example: "FEMALE" },
              birth: { type: "string", example: "2000-01-01" },
              address: { type: "string", example: "서울시 강남구" },
              phoneNumber: { type: "string", example: "010-1234-5678" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "회원가입 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  id: { type: "string", example: "1" },
                  email: { type: "string", example: "unyeon@umc.com" },
                  name: { type: "string", example: "언년" }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "이미 가입된 이메일",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M001" },
                  reason: { type: "string", example: "이미 사용 중인 이메일입니다." }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
  try {
    const result = await memberSignUp(bodyToSignUp(req.body))
    res.status(StatusCodes.CREATED).success(result)
  } catch (err) {
    next(err)
  }
}

// 내가 작성한 리뷰 목록 GET /api/v1/members/:memberId/reviews
export const handleGetMyReviews = async (req, res, next) => {
  /*
    #swagger.tags = ['Members']
    #swagger.summary = '내 리뷰 목록 조회 API (커서 페이지네이션)'
    #swagger.parameters['memberId'] = {
      in: 'path',
      description: '회원 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
    }
    #swagger.parameters['cursor'] = {
      in: 'query',
      description: '마지막으로 받은 리뷰 ID (첫 요청 시 생략)',
      required: false,
      schema: { type: 'integer', example: 5 }
    }
    #swagger.responses[200] = {
      description: "리뷰 목록 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "1" },
                        storeName: { type: "string", example: "맛있는 식당" },
                        content: { type: "string", example: "맛있어요!" },
                        score: { type: "number", example: 4.5 }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "integer", nullable: true, example: 3 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
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
    #swagger.summary = '내 도전 중인 미션 목록 조회 API (오프셋 페이지네이션)'
    #swagger.parameters['memberId'] = {
      in: 'path',
      description: '회원 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
    }
    #swagger.parameters['page'] = {
      in: 'query',
      description: '페이지 번호 (기본값: 1)',
      required: false,
      schema: { type: 'integer', example: 1 }
    }
    #swagger.responses[200] = {
      description: "도전 중인 미션 목록 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        missionId: { type: "string", example: "1" },
                        storeName: { type: "string", example: "맛있는 식당" },
                        missionContent: { type: "string", example: "10000원 이상 주문하기" },
                        reward: { type: "integer", example: 500 },
                        status: { type: "string", example: "CHALLENGING" }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      page: { type: "integer", example: 1 },
                      totalPages: { type: "integer", example: 3 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
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

// 진행 중인 미션 → 완료 처리 PATCH /api/v1/members/:memberId/missions/:missionId/complete
export const handleCompleteMission = async (req, res, next) => {
  /*
    #swagger.tags = ['Members']
    #swagger.summary = '미션 완료 처리 API'
    #swagger.parameters['memberId'] = {
      in: 'path',
      description: '회원 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
    }
    #swagger.parameters['missionId'] = {
      in: 'path',
      description: '미션 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
    }
    #swagger.responses[200] = {
      description: "미션 완료 처리 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  memberId: { type: "string", example: "1" },
                  missionId: { type: "string", example: "1" },
                  status: { type: "string", example: "COMPLETE" }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "이미 완료된 미션",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M002" },
                  reason: { type: "string", example: "이미 완료된 미션입니다." }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
  try {
    const { memberId, missionId } = req.params
    const result = await finishMission(memberId, missionId)
    res.success(result)
  } catch (err) {
    next(err)
  }
}
