import { prisma } from '../../../db.config.js'

// 가게 추가
export const addStore = async (data: { name: string }): Promise<number> => {
  const created = await prisma.store.create({ data })
  return created.id
}

// 가게 조회
export const getStoreById = async (storeId: number) =>
  prisma.store.findFirst({ where: { id: storeId } })

// 가게 리뷰 목록 조회 (커서 기반 페이지네이션)
export const getAllStoreReviews = async (storeId: number, cursor: number) =>
  prisma.userStoreReview.findMany({
    select: {
      id:      true,
      content: true,
      store:   true,
      user:    true,
    },
    where: {
      storeId,
      id: { gt: cursor },
    },
    orderBy: { id: 'asc' },
    take: 5,
  })
