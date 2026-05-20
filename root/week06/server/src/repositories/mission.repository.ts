import prisma from "../prisma";
import { errors } from "../errors";

export const completeMission = async (userMissionId: number) => {
  const userMission = await prisma.userMission.findUnique({ where: { id: userMissionId } });
  if (!userMission) throw errors.MISSION_NOT_FOUND;
  if (userMission.status === "COMPLETED") throw errors.ALREADY_COMPLETED;

  return prisma.userMission.update({
    where: { id: userMissionId },
    data: { status: "COMPLETED" },
  });
};