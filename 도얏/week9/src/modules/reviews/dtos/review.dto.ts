// 리뷰 추가 요청 인터페이스 (memberId는 JWT에서 자동 추출 → body에서 제거)
export interface ReviewCreateRequest {
  /**
   * 리뷰 내용
   * @example "음식이 정말 맛있었어요!"
   */
  content: string
  /**
   * 별점 (1~5)
   * @example 4.5
   */
  score: number
}

// 리뷰 생성 응답 인터페이스
export interface ReviewCreateResponse {
  /** 생성된 리뷰 ID */
  reviewId: number
  /** 작성자 회원 ID */
  memberId: number
  /** 가게 ID */
  storeId: number
  /** 리뷰 내용 */
  content: string
  /** 별점 */
  score: number
  /** 작성일시 */
  createdAt: Date
}

// 사용자 리뷰 목록 응답 인터페이스
export interface UserReviewListResponse {
  data: ReviewCreateResponse[]
  pagination: {
    /** 다음 페이지 커서 */
    cursor: number | null
  }
}

// req.body + userId → 내부 데이터로 변환
export const bodyToReview = (body: ReviewCreateRequest, userId: number) => {
  return {
    memberId: userId,
    content: body.content,
    score: body.score,
  }
}

// 리뷰 목록 → 응답 형태로 변환 (커서 기반 페이지네이션)
export const responseFromUserReviews = (reviews: any[]) => {
  const last = reviews[reviews.length - 1]
  return {
    data: reviews,
    pagination: { cursor: last ? last.id : null },
  }
}

// DB 결과 → 응답 형태로 변환
export const responseFromReview = (review: {
  id: number
  userId: number
  storeId: number
  content: string
}) => {
  return {
    reviewId: review.id,
    memberId: review.userId,
    storeId: review.storeId,
    content: review.content,
    score: 0,       // UserStoreReview 스키마에 score 없음 - 추후 확장
    createdAt: new Date(),
  }
}
