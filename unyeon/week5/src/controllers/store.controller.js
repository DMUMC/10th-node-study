import { StatusCodes } from 'http-status-codes'
import { bodyToStore, bodyToReview } from '../dtos/store.dto.js'
import { createStore, createReview } from '../services/store.service.js'

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
    // 이번 주차는 "DB에 저장된 첫 번째 사용자"로 가정 → memberId = 1
    const memberId = 1
    const result = await createReview(bodyToReview(memberId, storeId, req.body))
    res.status(StatusCodes.CREATED).success(result)
  } catch (err) {
    next(err)
  }
}
