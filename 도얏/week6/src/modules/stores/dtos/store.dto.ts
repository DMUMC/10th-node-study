// 가게 추가 요청 인터페이스
export interface StoreCreateRequest {
  regionId: number
  foodCategoryId: number
  name: string
  description?: string
  address: string
  lat?: number
  lng?: number
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
