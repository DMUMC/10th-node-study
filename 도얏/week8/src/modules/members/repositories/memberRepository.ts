import { prisma } from '../../../dbConfig.js'

export const addUser = async (data: {
  name: string
  nickname: string | null
  email: string
  password: string
  phoneNumber: string | null
  birth: Date | null
  gender: string | null
  address: string | null
  detailAddress: string | null
}) => {
  const created = await prisma.user.create({ data })
  return created.id
}

export const getUser = async (userId: number) =>
  prisma.user.findFirst({ where: { id: userId } })

export const getUserByEmail = async (email: string) =>
  prisma.user.findFirst({ where: { email } })

export const setPreference = async (userId: number, foodCategoryId: number) =>
  prisma.userFavorCategory.create({ data: { userId, foodCategoryId } })

export const getUserPreferencesByUserId = async (userId: number) =>
  prisma.userFavorCategory.findMany({
    where: { userId },
    include: { foodCategory: true },
    orderBy: { foodCategoryId: 'asc' },
  })
