import { prisma } from '../../../dbConfig.js'

export const addStore = async (data: { name: string }): Promise<number> => {
  const created = await prisma.store.create({ data })
  return created.id
}

export const getStoreById = async (storeId: number) =>
  prisma.store.findFirst({ where: { id: storeId } })

export const getAllStoreReviews = async (storeId: number, cursor: number) =>
  prisma.userStoreReview.findMany({
    select: {
      id: true,
      userId: true,
      storeId: true,
      content: true,
    },
    where: {
      storeId,
      id: { gt: cursor },
    },
    orderBy: { id: 'asc' },
    take: 5,
  })
