import { prisma } from '../db.config.js'

// 미션 존재 확인
export const existsMission = async (missionId) => {
  const mission = await prisma.mission.findUnique({ where: { id: BigInt(missionId) } })
  return mission !== null
}

// 미션 생성
export const addMission = async (data) => {
  const created = await prisma.mission.create({
    data: {
      storeId: BigInt(data.storeId),
      title: data.title,
      reward: data.reward,
      spec: data.spec,
      deadLine: data.deadLine ? new Date(data.deadLine) : null,
    },
  })
  return created.id
}

// id로 미션 단건 조회
export const getMissionById = async (missionId) => {
  return prisma.mission.findUnique({ where: { id: BigInt(missionId) } })
}

// 이미 도전 중인 미션인지 확인
export const existsMemberMission = async (memberId, missionId) => {
  const mm = await prisma.memberMission.findFirst({
    where: { memberId: BigInt(memberId), missionId: BigInt(missionId) },
  })
  return mm !== null
}

// 미션 도전 추가
export const addMemberMission = async (memberId, missionId) => {
  return prisma.memberMission.create({
    data: { memberId: BigInt(memberId), missionId: BigInt(missionId), status: 'CHALLENGING' },
  })
}
