import { prisma } from '../../../dbConfig.js'

// 유저 생성 (이메일 중복 시 null 반환)
export const addUser = async (data: any) => {
  const exists = await prisma.user.findFirst({ where: { email: data.email } })
  if (exists) return null

  const created = await prisma.user.create({ data })
  return created.id
}

// 유저 조회 (없으면 예외 throw)
export const getUser = async (userId: number) =>
  prisma.user.findFirstOrThrow({ where: { id: userId } })

// 유저 정보 수정 (미션 2: PATCH /members/me)
export const updateUser = async (userId: number, data: Record<string, any>) =>
  prisma.user.update({ where: { id: userId }, data })

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
