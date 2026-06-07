import { prisma } from '../../../dbConfig.js'
import { MissionStatus } from '../dtos/missionDto.js'

export const addMission = async (data: {
  storeId: number
  title: string
  reward: number
  spec: string | null
  deadLine: Date | null
}): Promise<number> => {
  const created = await prisma.mission.create({
    data: {
      storeId: data.storeId,
      title: data.title,
      reward: data.reward,
      spec: data.spec,
      deadLine: data.deadLine,
    },
  })
  return created.id
}

export const getMissionById = async (missionId: number) =>
  prisma.mission.findFirst({ where: { id: missionId } })

export const findMemberMission = async (memberId: number, missionId: number) =>
  prisma.memberMission.findFirst({
    where: { memberId, missionId },
  })

export const addMemberMission = async (
  memberId: number,
  missionId: number,
  status: MissionStatus,
): Promise<number> => {
  const created = await prisma.memberMission.create({
    data: { memberId, missionId, status },
  })
  return created.id
}

export const getMemberMissionById = async (memberMissionId: number) =>
  prisma.memberMission.findFirst({ where: { id: memberMissionId } })

export const getMemberMissionByMemberAndMission = async (memberId: number, missionId: number) =>
  prisma.memberMission.findFirst({ where: { memberId, missionId } })

export const getStoreMissions = async (storeId: number, cursor: number) =>
  prisma.mission.findMany({
    where: { storeId, id: { gt: cursor } },
    orderBy: { id: 'asc' },
    take: 5,
  })

export const getOngoingMissions = async (memberId: number, cursor: number) =>
  prisma.memberMission.findMany({
    where: { memberId, status: MissionStatus.CHALLENGING, id: { gt: cursor } },
    include: { mission: { include: { store: true } } },
    orderBy: { id: 'asc' },
    take: 5,
  })

export const completeMission = async (memberId: number, missionId: number) =>
  prisma.memberMission.updateMany({
    where: { memberId, missionId, status: MissionStatus.CHALLENGING },
    data: { status: MissionStatus.COMPLETE },
  })
