import { prisma } from '../../../db.config.js'

// 유저 생성
export const addUser = async (data: any) => {
  const exists = await prisma.user.findFirst({ where: { email: data.email } })
  if (exists) return null

  const created = await prisma.user.create({ data })
  return created.id
}

// 유저 조회 (없으면 예외 throw)
export const getUser = async (userId: number) =>
  prisma.user.findFirstOrThrow({ where: { id: userId } })

// 선호 음식 카테고리 등록
export const setPreference = async (userId: number, foodCategoryId: number) =>
  prisma.userFavorCategory.create({ data: { userId, foodCategoryId } })

// 선호 카테고리 목록 조회 (JOIN 포함)
export const getUserPreferencesByUserId = async (userId: number) =>
  prisma.userFavorCategory.findMany({
    where: { userId },
    include: { foodCategory: true },
    orderBy: { foodCategoryId: 'asc' },
  })
