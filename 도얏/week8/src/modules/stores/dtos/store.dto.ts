// 가게 추가 요청 인터페이스
export interface StoreCreateRequest {
  /**
   * 지역 ID
   * @example 1
   */
  regionId: number
  /**
   * 음식 카테고리 ID
   * @example 2
   */
  foodCategoryId: number
  /** 가게 이름 */
  name: string
  /** 가게 설명 */
  description?: string
  /**
   * 가게 주소
   * @example "서울시 강남구 테헤란로 123"
   */
  address: string
  /**
   * 위도
   * @example 37.5665
   */
  lat?: number
  /**
   * 경도
   * @example 126.978
   */
  lng?: number
}

// 가게 생성 응답 인터페이스
export interface StoreCreateResponse {
  /** 생성된 가게 ID */
  storeId: number
  /** 가게 이름 */
  name: string
  /** 가게 주소 */
  address: string
  /** 지역 ID */
  regionId: number
}

// 리뷰 아이템 인터페이스
export interface ReviewItem {
  /** 리뷰 ID */
  reviewId: number
  /** 작성자 회원 ID */
  memberId: number
  /** 가게 ID */
  storeId: number
  /** 리뷰 내용 */
  content: string
  /** 별점 (1~5) */
  score: number
  /** 작성일시 */
  createdAt: Date
}

// 리뷰 목록 응답 인터페이스 (커서 기반 페이지네이션)
export interface ReviewListResponse {
  data: ReviewItem[]
  pagination: {
    /** 다음 페이지 커서 (마지막 항목의 ID, 없으면 null) */
    cursor: number | null
  }
}

// req.body → 내부 데이터로 변환
export const bodyToStore = (body: StoreCreateRequest) => {
  return {
    regionId: body.regionId,
    foodCategoryId: body.foodCategoryId,
    name: body.name,
    description: body.description ?? null,
    address: body.address,
    lat: body.lat ?? null,
    lng: body.lng ?? null,
  }
}

// 리뷰 목록 → 응답 형태로 변환 (커서 기반 페이지네이션)
export const responseFromReviews = (reviews: any[]) => {
  const last = reviews[reviews.length - 1]
  return {
    data: reviews,
    pagination: {
      cursor: last ? last.id : null,
    },
  }
}

// DB 조회 결과 → 응답 형태로 변환
export const responseFromStore = (store: {
  id: number
  name: string
  address: string
  region_id: number
}) => {
  return {
    storeId: store.id,
    name: store.name,
    address: store.address,
    regionId: store.region_id,
  }
}
