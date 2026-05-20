import prisma from "./prisma";

// 내가 작성한 리뷰 목록
export const getMyReviews = (userId: number) =>
  prisma.review.findMany({
    where: { userId },
    include: { store: true },
    orderBy: { createdAt: "desc" },
  });

// 특정 가게의 미션 목록
export const getStoreMissions = (storeId: number) =>
  prisma.mission.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

// 내가 진행 중인 미션 목록
export const getMyMissions = (userId: number, status: string) =>
  prisma.userMission.findMany({
    where: { userId, status: status as any },
    include: { mission: { include: { store: true } } },
    orderBy: { createdAt: "desc" },
  });

// 미션 완료 처리
export const completeMission = (userMissionId: number) =>
  prisma.userMission.update({
    where: { id: userMissionId },
    data: { status: "COMPLETED" },
  });