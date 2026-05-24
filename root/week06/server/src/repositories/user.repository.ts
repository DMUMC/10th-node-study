import prisma from "../prisma";
import { errors } from "../errors";

export const getMyReviews = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw errors.USER_NOT_FOUND;

  return prisma.review.findMany({
    where: { userId },
    include: { store: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getMyMissions = async (userId: number, status: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw errors.USER_NOT_FOUND;

  return prisma.userMission.findMany({
    where: { userId, status: status as any },
    include: { mission: { include: { store: true } } },
    orderBy: { createdAt: "desc" },
  });
};