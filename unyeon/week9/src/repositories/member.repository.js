import { prisma } from '../db.config.js'

// 이메일로 회원 조회
export const findMemberByEmail = async (email) => {
  return prisma.member.findUnique({ where: { email } })
}

// 회원 추가
export const addMember = async (data) => {
  const exists = await prisma.member.findUnique({ where: { email: data.email } })
  if (exists) return null

  const created = await prisma.member.create({ data })
  return created.id
}

// id로 회원 단건 조회
export const getMemberById = async (memberId) => {
  return prisma.member.findUnique({ where: { id: memberId } })
}

// 회원 존재 확인
export const existsMember = async (memberId) => {
  const member = await prisma.member.findUnique({ where: { id: memberId } })
  return member !== null
}

// 내가 작성한 리뷰 목록 (cursor 페이지네이션)
export const getMemberReviews = async (memberId, cursor) => {
  return prisma.review.findMany({
    where: { memberId: BigInt(memberId) },
    take: 10,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { id: BigInt(cursor) } }),
    orderBy: { createdAt: 'desc' },
    include: {
      store: { select: { name: true } },
    },
  })
}

// 내가 진행 중인 미션 목록 (offset 페이지네이션)
export const getMemberChallengingMissions = async (memberId, page = 1) => {
  const take = 10
  const skip = (page - 1) * take
  return prisma.memberMission.findMany({
    where: { memberId: BigInt(memberId), status: 'CHALLENGING' },
    take,
    skip,
    orderBy: { createdAt: 'desc' },
    include: {
      mission: {
        include: { store: { select: { name: true } } },
      },
    },
  })
}

// 진행 중인 미션 → 완료 처리 (복합 PK: memberId + missionId)
export const completeMemberMission = async (memberId, missionId) => {
  return prisma.memberMission.update({
    where: { memberId_missionId: { memberId: BigInt(memberId), missionId: BigInt(missionId) } },
    data: { status: 'COMPLETE' },
  })
}

// 회원 정보 수정
export const updateMember = async (memberId, data) => {
  return prisma.member.update({
    where: { id: BigInt(memberId) },
    data,
  })
}
