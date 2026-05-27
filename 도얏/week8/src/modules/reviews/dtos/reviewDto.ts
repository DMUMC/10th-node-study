export interface ReviewCreateRequest {
  /**
   * 작성자 회원 ID
   * @example 1
   */
  memberId: number
  /**
   * 리뷰 내용
   * @example "음식이 정말 맛있었어요."
   */
  content: string
  /**
   * 별점 (1~5). 현재 DB에는 저장하지 않고 입력 검증에만 사용합니다.
   * @example 4.5
   */
  score?: number
}

export interface ReviewCreateResponse {
  /** 생성된 리뷰 ID */
  reviewId: number
  /** 작성자 회원 ID */
  memberId: number
  /** 가게 ID */
  storeId: number
  /** 리뷰 내용 */
  content: string
}

export interface UserReviewListResponse {
  data: ReviewCreateResponse[]
  pagination: {
    /** 다음 페이지 커서 */
    cursor: number | null
  }
}

export const bodyToReview = (body: ReviewCreateRequest) => {
  return {
    memberId: body.memberId,
    content: body.content,
  }
}

export const responseFromUserReviews = (reviews: Array<{
  id: number
  userId: number
  storeId: number
  content: string
}>): UserReviewListResponse => {
  const last = reviews[reviews.length - 1]
  return {
    data: reviews.map(responseFromReview),
    pagination: { cursor: last ? last.id : null },
  }
}

export const responseFromReview = (review: {
  id: number
  userId: number
  storeId: number
  content: string
}): ReviewCreateResponse => {
  return {
    reviewId: review.id,
    memberId: review.userId,
    storeId: review.storeId,
    content: review.content,
  }
}
