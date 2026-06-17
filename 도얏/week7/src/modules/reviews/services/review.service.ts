import { ReviewCreateRequest, bodyToReview, responseFromReview, responseFromUserReviews } from '../dtos/review.dto.js'
import { addReview, getReviewById, getUserReviews } from '../repositories/review.repository.js'
import { getStoreById } from '../../stores/repositories/store.repository.js'
import { BaseError } from '../../../utils/errors.js'
import { ErrorCode } from '../../../utils/errorCode.js'

export const listUserReviews = async (userId: number, cursor: number) => {
  const reviews = await getUserReviews(userId, cursor)
  return responseFromUserReviews(reviews)
}

export const createReview = async (storeId: number, data: ReviewCreateRequest) => {
  const store = await getStoreById(storeId)
  if (!store) {
    throw new BaseError(
      ErrorCode.STORE_NOT_FOUND.message,
      ErrorCode.STORE_NOT_FOUND.status,
      ErrorCode.STORE_NOT_FOUND.code,
    )
  }

  if (data.score < 1 || data.score > 5) {
    throw new BaseError(
      ErrorCode.INVALID_SCORE.message,
      ErrorCode.INVALID_SCORE.status,
      ErrorCode.INVALID_SCORE.code,
    )
  }

  const reviewData = bodyToReview(data)
  const reviewId = await addReview({ ...reviewData, storeId })

  const review = await getReviewById(reviewId)
  if (!review) {
    throw new BaseError(
      ErrorCode.REVIEW_CREATE_FAILED.message,
      ErrorCode.REVIEW_CREATE_FAILED.status,
      ErrorCode.REVIEW_CREATE_FAILED.code,
    )
  }

  return responseFromReview(review as {
    id: number
    member_id: number
    store_id: number
    content: string
    score: number
    created_at: Date
  })
}
