// 가게 생성 요청 body → Store 객체
export const bodyToStore = (regionId, body) => {
  return {
    regionId: Number(regionId),
    foodCategoryId: Number(body.foodCategoryId),
    name: body.name,
    description: body.description ?? null,
    address: body.address ?? null,
    lat: body.lat ?? null,
    lng: body.lng ?? null,
  }
}

// 가게 생성 응답 DTO
export const responseFromStore = (store) => {
  return {
    id: store.id,
    regionId: store.region_id,
    foodCategoryId: store.food_category_id,
    name: store.name,
    description: store.description,
    address: store.address,
    status: store.status,
    createdAt: store.created_at,
  }
}

// 리뷰 추가 요청 body → Review 객체
export const bodyToReview = (memberId, storeId, body) => {
  return {
    memberId: Number(memberId),
    storeId: Number(storeId),
    content: body.content,
    score: Number(body.score),
  }
}

// 리뷰 생성 응답 DTO
export const responseFromReview = (review) => {
  return {
    id: review.id,
    memberId: review.member_id,
    storeId: review.store_id,
    content: review.content,
    score: Number(review.score),
    createdAt: review.created_at,
  }
}
