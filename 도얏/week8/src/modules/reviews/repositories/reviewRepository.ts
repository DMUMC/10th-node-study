import { prisma } from '../../../dbConfig.js'

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

export const getReviewById = async (reviewId: number) =>
  prisma.userStoreReview.findFirst({ where: { id: reviewId } })

export const getUserReviews = async (userId: number, cursor: number) =>
  prisma.userStoreReview.findMany({
    where: { userId, id: { gt: cursor } },
    orderBy: { id: 'asc' },
    take: 5,
  })
