export interface StoreCreateRequest {
  /** 가게 이름 */
  name: string
}

export interface StoreCreateResponse {
  /** 생성된 가게 ID */
  storeId: number
  /** 가게 이름 */
  name: string
}

export interface ReviewItem {
  /** 리뷰 ID */
  reviewId: number
  /** 작성자 회원 ID */
  memberId: number
  /** 가게 ID */
  storeId: number
  /** 리뷰 내용 */
  content: string
}

export interface ReviewListResponse {
  data: ReviewItem[]
  pagination: {
    /** 다음 페이지 커서 */
    cursor: number | null
  }
}

export const bodyToStore = (body: StoreCreateRequest) => {
  return {
    name: body.name,
  }
}

export const responseFromReviews = (reviews: Array<{
  id: number
  userId: number
  storeId: number
  content: string
}>): ReviewListResponse => {
  const last = reviews[reviews.length - 1]
  return {
    data: reviews.map((review) => ({
      reviewId: review.id,
      memberId: review.userId,
      storeId: review.storeId,
      content: review.content,
    })),
    pagination: {
      cursor: last ? last.id : null,
    },
  }
}

export const responseFromStore = (store: {
  id: number
  name: string
}): StoreCreateResponse => {
  return {
    storeId: store.id,
    name: store.name,
  }
}
