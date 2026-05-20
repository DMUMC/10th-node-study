import { prisma } from '../../../db.config.js'

// 미션 추가
export const addMission = async (data: {
  storeId:  number
  title:    string
  reward:   number
  spec:     string | null
  deadLine: Date | null
}): Promise<number> => {
  const created = await prisma.mission.create({
    data: {
      storeId:  data.storeId,
      title:    data.title,
      reward:   data.reward,
      spec:     data.spec,
      deadLine: data.deadLine,
    },
  })
  return created.id
}

// 미션 조회
export const getMissionById = async (missionId: number) =>
  prisma.mission.findFirst({ where: { id: missionId } })

// 이미 도전 중인 미션인지 확인
export const findMemberMission = async (memberId: number, missionId: number) =>
  prisma.memberMission.findFirst({
    where: { userId: memberId, missionId },
  })

// 미션 도전 추가
export const addMemberMission = async (
  memberId:  number,
  missionId: number,
  status:    string,
): Promise<number> => {
  const created = await prisma.memberMission.create({
    data: { userId: memberId, missionId, status },
  })
  return created.id
}

// 미션 도전 기록 조회
export const getMemberMissionById = async (memberMissionId: number) =>
  prisma.memberMission.findFirst({ where: { id: memberMissionId } })

// 특정 가게의 미션 목록 조회 (커서 기반 페이지네이션)
export const getStoreMissions = async (storeId: number, cursor: number) =>
  prisma.mission.findMany({
    where: { storeId, id: { gt: cursor } },
    orderBy: { id: 'asc' },
    take: 5,
  })


// 유저가 진행 중인 미션 목록 조회
export const getOngoingMissions = async (userId: number, cursor: number) =>
  prisma.memberMission.findMany({
    where: { userId, status: '진행중', id: { gt: cursor } },
    include: { mission: { include: { store: true } } },
    orderBy: { id: 'asc' },
    take: 5,
  })

// 진행 중인 미션을 완료로 변경
export const completeMission = async (userId: number, missionId: number) =>
  prisma.memberMission.updateMany({
    where: { userId, missionId, status: '진행중' },
    data:  { status: '완료' },
  })