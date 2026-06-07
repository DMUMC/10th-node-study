import bcrypt from "bcrypt";
import prisma from "../prisma";
import { errors } from "../errors";

export const createUser = async (email: string, password: string, nickname: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw errors.EMAIL_ALREADY_EXISTS;

  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { email, password: hashed, nickname },
    select: { id: true, email: true, nickname: true, createdAt: true },
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw errors.USER_NOT_FOUND;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw errors.INVALID_PASSWORD;

  return user;
};

export const updateUser = async (
  userId: number,
  data: { nickname?: string; phone?: string; birthday?: string }
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw errors.USER_NOT_FOUND;

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
      birthday: data.birthday ? new Date(data.birthday) : undefined,
    },
    select: { id: true, email: true, nickname: true, phone: true, birthday: true },
  });
};