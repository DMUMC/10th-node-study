// 리뷰 추가 요청 인터페이스
export interface ReviewCreateRequest {
  memberId: number
  content: string
  score: number
}

// req.body → 내부 데이터로 변환
export const bodyToReview = (body: ReviewCreateRequest) => {
  return {
    memberId: body.memberId,
    content: body.content,
    score: body.score,
  }
}

// DB 결과 → 응답 형태로 변환
export const responseFromReview = (review: {
  id: number
  member_id: number
  store_id: number
  content: string
  score: number
  created_at: Date
}) => {
  return {
    reviewId: review.id,
    memberId: review.member_id,
    storeId: review.store_id,
    content: review.content,
    score: review.score,
    createdAt: review.created_at,
  }
}
