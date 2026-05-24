import { prisma } from '../db.config.js'

// 지역 존재 확인
export const existsRegion = async (regionId) => {
  const region = await prisma.region.findUnique({ where: { id: BigInt(regionId) } })
  return region !== null
}

// 가게 존재 확인
export const existsStore = async (storeId) => {
  const store = await prisma.store.findUnique({ where: { id: BigInt(storeId) } })
  return store !== null
}

// 가게 생성
export const addStore = async (data) => {
  const created = await prisma.store.create({
    data: {
      regionId: data.regionId,
      foodCategoryId: data.foodCategoryId,
      name: data.name,
      description: data.description,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
    },
  })
  return created.id
}

// id로 가게 단건 조회
export const getStoreById = async (storeId) => {
  return prisma.store.findUnique({ where: { id: BigInt(storeId) } })
}

// 리뷰 생성
export const addReview = async (data) => {
  const created = await prisma.review.create({
    data: {
      memberId: data.memberId,
      storeId: data.storeId,
      content: data.content,
      score: data.score,
    },
  })
  return created.id
}

// id로 리뷰 단건 조회
export const getReviewById = async (reviewId) => {
  return prisma.review.findUnique({ where: { id: BigInt(reviewId) } })
}

// 특정 가게의 미션 목록 (cursor 페이지네이션)
export const getStoreMissions = async (storeId, cursor) => {
  return prisma.mission.findMany({
    where: { storeId: BigInt(storeId) },
    take: 10,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { id: BigInt(cursor) } }),
    orderBy: { createdAt: 'desc' },
  })
}
