import { ReviewCreateRequest, bodyToReview, responseFromReview, responseFromUserReviews } from '../dtos/review.dto.js'
import { addReview, getReviewById, getUserReviews } from '../repositories/review.repository.js'
import { getStoreById } from '../../stores/repositories/store.repository.js'

const makeError = (message: string, status: number): Error & { status: number } => {
  const err = new Error(message) as Error & { status: number }
  err.status = status
  return err
}

export const listUserReviews = async (userId: number, cursor: number) => {
  const reviews = await getUserReviews(userId, cursor)
  return responseFromUserReviews(reviews)
}

export const createReview = async (storeId: number, data: ReviewCreateRequest) => {
  // 가게 존재 여부 검증
  const store = await getStoreById(storeId)
  if (!store) {
    throw makeError('존재하지 않는 가게입니다.', 404)
  }

  // 별점 유효성 검사
  if (data.score < 1 || data.score > 5) {
    throw makeError('별점은 1~5 사이여야 합니다.', 400)
  }

  const reviewData = bodyToReview(data)
  const reviewId = await addReview({ ...reviewData, storeId })

  const review = await getReviewById(reviewId)
  if (!review) {
    throw makeError('리뷰 생성 후 조회에 실패했습니다.', 500)
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
