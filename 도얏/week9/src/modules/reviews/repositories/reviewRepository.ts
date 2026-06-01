import { prisma } from '../../../dbConfig.js'

// 리뷰 추가
export const addReview = async (data: {
  memberId: number
  storeId: number
  content: string
}): Promise<number> => {
  const created = await prisma.userStoreReview.create({
    data: {
      userId: data.memberId,
      storeId: data.storeId,
      content: data.content,
    },
  })
  return created.id
}

// 리뷰 조회
export const getReviewById = async (reviewId: number) =>
  prisma.userStoreReview.findFirst({ where: { id: reviewId } })

// 내가 작성한 리뷰 목록 조회 (커서 기반 페이지네이션)
export const getUserReviews = async (userId: number, cursor: number) =>
  prisma.userStoreReview.findMany({
    where: { userId, id: { gt: cursor } },
    orderBy: { id: 'asc' },
    take: 5,
  })
