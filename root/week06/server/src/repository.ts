import prisma from "./prisma";
import { errors } from "./errors";

// 내가 작성한 리뷰 목록
export const getMyReviews = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw errors.USER_NOT_FOUND;

  return prisma.review.findMany({
    where: { userId },
    include: { store: true },
    orderBy: { createdAt: "desc" },
  });
};

// 특정 가게의 미션 목록
export const getStoreMissions = async (storeId: number) => {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) throw errors.STORE_NOT_FOUND;

  return prisma.mission.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });
};

// 내가 진행 중인 미션 목록
export const getMyMissions = async (userId: number, status: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw errors.USER_NOT_FOUND;

  return prisma.userMission.findMany({
    where: { userId, status: status as any },
    include: { mission: { include: { store: true } } },
    orderBy: { createdAt: "desc" },
  });
};

// 미션 완료 처리
export const completeMission = async (userMissionId: number) => {
  const userMission = await prisma.userMission.findUnique({ where: { id: userMissionId } });
  if (!userMission) throw errors.MISSION_NOT_FOUND;
  if (userMission.status === "COMPLETED") throw errors.ALREADY_COMPLETED;

  return prisma.userMission.update({
    where: { id: userMissionId },
    data: { status: "COMPLETED" },
  });
};