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
