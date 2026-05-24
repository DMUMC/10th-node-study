import { StatusCodes } from 'http-status-codes'
import { bodyToMission } from '../dtos/mission.dto.js'
import {
  createMission,
  challengeMission,
} from '../services/mission.service.js'

// 3. 가게에 미션 추가
export const handleCreateMission = async (req, res, next) => {
  /*
    #swagger.tags = ['Missions']
    #swagger.summary = '가게에 미션 추가 API'
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
              content: { type: "string", example: "10000원 이상 주문하기" },
              reward: { type: "integer", example: 500 },
              deadline: { type: "string", example: "2025-12-31" }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "미션 추가 성공",
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
                  content: { type: "string", example: "10000원 이상 주문하기" },
                  reward: { type: "integer", example: 500 }
                }
              }
            }
          }
        }
      }
    }
  */
  try {
    const { storeId } = req.params
    const result = await createMission(bodyToMission(storeId, req.body))
    res.status(StatusCodes.CREATED).success(result)
  } catch (err) {
    next(err)
  }
}

// 4. 미션 도전하기
export const handleChallengeMission = async (req, res, next) => {
  /*
    #swagger.tags = ['Missions']
    #swagger.summary = '미션 도전하기 API'
    #swagger.parameters['missionId'] = {
      in: 'path',
      description: '미션 ID',
      required: true,
      schema: { type: 'integer', example: 1 }
    }
    #swagger.responses[201] = {
      description: "미션 도전 성공",
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
                  status: { type: "string", example: "CHALLENGING" }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "이미 도전 중인 미션",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "MI001" },
                  reason: { type: "string", example: "이미 도전 중인 미션입니다." }
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
    const { missionId } = req.params
    const memberId = 1
    const result = await challengeMission({
      memberId,
      missionId: Number(missionId),
    })
    res.status(StatusCodes.CREATED).success(result)
  } catch (err) {
    next(err)
  }
}
