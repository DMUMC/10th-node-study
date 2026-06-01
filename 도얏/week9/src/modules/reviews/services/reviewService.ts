import { ReviewCreateRequest, bodyToReview, responseFromReview, responseFromUserReviews } from '../dtos/reviewDto.js'
import { addReview, getReviewById, getUserReviews } from '../repositories/reviewRepository.js'
import { getStoreById } from '../../stores/repositories/storeRepository.js'
import { getUser } from '../../members/repositories/memberRepository.js'
import { BaseError } from '../../../utils/errors.js'
import { ErrorCode } from '../../../utils/errorCode.js'

export const listUserReviews = async (userId: number, cursor: number) => {
  const user = await getUser(userId)
  if (!user) {
    throw new BaseError(ErrorCode.USER_NOT_FOUND)
  }

  const reviews = await getUserReviews(userId, cursor)
  return responseFromUserReviews(reviews)
}

// userId는 JWT에서 추출한 값 (body.memberId 제거)
export const createReview = async (storeId: number, userId: number, data: ReviewCreateRequest) => {
  const store = await getStoreById(storeId)
  if (!store) {
    throw new BaseError(ErrorCode.STORE_NOT_FOUND)
  }

  const user = await getUser(userId)
  if (!user) {
    throw new BaseError(ErrorCode.USER_NOT_FOUND)
  }

  if (data.score !== undefined && (data.score < 1 || data.score > 5)) {
    throw new BaseError(ErrorCode.INVALID_SCORE)
  }

  const reviewData = bodyToReview(data, userId)
  const reviewId = await addReview({ ...reviewData, storeId })

  const review = await getReviewById(reviewId)
  if (!review) {
    throw new BaseError(ErrorCode.REVIEW_CREATE_FAILED)
  }

  return responseFromReview(review)
}
