import { StatusCodes } from 'http-status-codes'
import { bodyToStore, bodyToReview } from '../dtos/store.dto.js'
import { createStore, createReview, listStoreMissions } from '../services/store.service.js'

// 1. 특정 지역에 가게 추가
export const handleCreateStore = async (req, res, next) => {
  /*
    #swagger.tags = ['Stores']
    #swagger.summary = '가게 추가 API'
    #swagger.parameters['regionId'] = {
      in: 'path',
      description: '지역 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "맛있는 식당" },
              address: { type: "string", example: "서울시 강남구 테헤란로 1길" },
              score: { type: "number", example: 4.5 }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "가게 추가 성공",
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
                  name: { type: "string", example: "맛있는 식당" },
                  address: { type: "string", example: "서울시 강남구 테헤란로 1길" }
                }
              }
            }
          }
        }
      }
    }
  */
  try {
    const { regionId } = req.params
    const result = await createStore(bodyToStore(regionId, req.body))
    res.status(StatusCodes.CREATED).success(result)
  } catch (err) {
    next(err)
  }
}

// 2. 가게에 리뷰 추가
export const handleCreateReview = async (req, res, next) => {
  /*
    #swagger.tags = ['Stores']
    #swagger.summary = '가게 리뷰 추가 API'
    #swagger.parameters['storeId'] = {
      in: 'path',
      description: '가게 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              content: { type: "string", example: "정말 맛있어요!" },
              score: { type: "number", example: 4.5 }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "리뷰 추가 성공",
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
                  content: { type: "string", example: "정말 맛있어요!" },
                  score: { type: "number", example: 4.5 }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: "가게를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "S001" },
                  reason: { type: "string", example: "존재하지 않는 가게입니다." }
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
    const { storeId } = req.params
    const memberId = 1
    const result = await createReview(bodyToReview(memberId, storeId, req.body))
    res.status(StatusCodes.CREATED).success(result)
  } catch (err) {
    next(err)
  }
}

// 특정 가게의 미션 목록 GET /api/v1/stores/:storeId/missions
export const handleGetStoreMissions = async (req, res, next) => {
  /*
    #swagger.tags = ['Stores']
    #swagger.summary = '가게 미션 목록 조회 API (커서 페이지네이션)'
    #swagger.parameters['storeId'] = {
      in: 'path',
      description: '가게 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
    }
    #swagger.parameters['cursor'] = {
      in: 'query',
      description: '마지막으로 받은 미션 ID (첫 요청 시 생략)',
      required: false,
      schema: { type: 'integer', example: 5 }
    }
    #swagger.responses[200] = {
      description: "미션 목록 조회 성공",
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
                        content: { type: "string", example: "10000원 이상 주문하기" },
                        reward: { type: "integer", example: 500 },
                        deadline: { type: "string", example: "2025-12-31" }
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
    const storeId = Number(req.params.storeId)
    const cursor = req.query.cursor ? Number(req.query.cursor) : null
    const result = await listStoreMissions(storeId, cursor)
    res.success(result)
  } catch (err) {
    next(err)
  }
}
