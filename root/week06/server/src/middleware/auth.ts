import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      isSuccess: false,
      code: "4011",
      message: "로그인이 필요합니다.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({
      isSuccess: false,
      code: "4012",
      message: "유효하지 않은 토큰입니다.",
    });
  }
};