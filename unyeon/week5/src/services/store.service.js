import {
  addStore,
  addReview,
  existsRegion,
  existsStore,
  getStoreById,
  getReviewById,
} from '../repositories/store.repository.js'
import { responseFromStore, responseFromReview } from '../dtos/store.dto.js'
import { RegionNotFoundError, StoreNotFoundError, BadRequestError } from '../errors.js'

// 1. 특정 지역에 가게 추가
export const createStore = async (data) => {
  if (!data.name || !data.foodCategoryId) {
    throw new BadRequestError('가게명과 음식 카테고리는 필수입니다.')
  }

  // 지역 존재 검증
  const regionExists = await existsRegion(data.regionId)
  if (!regionExists) {
    throw new RegionNotFoundError(data.regionId)
  }

  const newStoreId = await addStore(data)
  const newStore = await getStoreById(newStoreId)
  return responseFromStore(newStore)
}

// 2. 가게에 리뷰 추가 (필수 API)
export const createReview = async (data) => {
  if (!data.content || data.score == null) {
    throw new BadRequestError('리뷰 내용과 별점은 필수입니다.')
  }
  if (data.score < 0 || data.score > 5) {
    throw new BadRequestError('별점은 0~5 사이여야 합니다.', { score: data.score })
  }

  // 가게 존재 검증
  const storeExists = await existsStore(data.storeId)
  if (!storeExists) {
    throw new StoreNotFoundError(data.storeId)
  }

  const newReviewId = await addReview(data)
  const newReview = await getReviewById(newReviewId)
  return responseFromReview(newReview)
}
