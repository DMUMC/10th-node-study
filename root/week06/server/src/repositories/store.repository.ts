import prisma from "../prisma";
import { errors } from "../errors";

export const getStoreMissions = async (storeId: number) => {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) throw errors.STORE_NOT_FOUND;

  return prisma.mission.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });
};