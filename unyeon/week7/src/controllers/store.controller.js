import { StatusCodes } from 'http-status-codes'
import { bodyToStore, bodyToReview } from '../dtos/store.dto.js'
import { createStore, createReview, listStoreMissions } from '../services/store.service.js'

// 1. 특정 지역에 가게 추가
export const handleCreateStore = async (req, res, next) => {
  try {
    const { regionId } = req.params
    const result = await createStore(bodyToStore(regionId, req.body))
    res.status(StatusCodes.CREATED).success(result)
  } catch (err) {
    next(err)
  }
}

// 2. 가게에 리뷰 추가 (필수 API)
export const handleCreateReview = async (req, res, next) => {
  try {
    const { storeId } = req.params
    const memberId = 1  // 임시: 실제로는 인증 미들웨어에서 가져와야 함
    const result = await createReview(bodyToReview(memberId, storeId, req.body))
    res.status(StatusCodes.CREATED).success(result)
  } catch (err) {
    next(err)
  }
}

// 특정 가게의 미션 목록 GET /api/v1/stores/:storeId/missions
export const handleGetStoreMissions = async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId)
    const cursor = req.query.cursor ? Number(req.query.cursor) : null
    const result = await listStoreMissions(storeId, cursor)
    res.success(result)
  } catch (err) {
    next(err)
  }
}
