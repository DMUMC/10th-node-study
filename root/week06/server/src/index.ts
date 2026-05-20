import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import * as repo from "./repository";
import { AppError } from "./errors";

const app = express();

// 미들웨어
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 성공 응답 헬퍼
const success = (result: any) => ({
  isSuccess: true,
  code: "2000",
  message: "성공",
  result,
});

// 내가 작성한 리뷰 목록
app.get("/api/users/:userId/reviews", async (req, res, next) => {
  try {
    const result = await repo.getMyReviews(Number(req.params.userId));
    res.json(success(result));
  } catch (err) { next(err); }
});

// 특정 가게의 미션 목록
app.get("/api/stores/:storeId/missions", async (req, res, next) => {
  try {
    const result = await repo.getStoreMissions(Number(req.params.storeId));
    res.json(success(result));
  } catch (err) { next(err); }
});

// 내가 진행 중인 미션 목록
app.get("/api/users/:userId/missions", async (req, res, next) => {
  try {
    const status = (req.query.status as string) ?? "IN_PROGRESS";
    const result = await repo.getMyMissions(Number(req.params.userId), status);
    res.json(success(result));
  } catch (err) { next(err); }
});

// 미션 완료 처리
app.patch("/api/user-missions/:userMissionId/complete", async (req, res, next) => {
  try {
    const result = await repo.completeMission(Number(req.params.userMissionId));
    res.json(success(result));
  } catch (err) { next(err); }
});

// 에러 핸들러
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      isSuccess: false,
      code: err.code,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      isSuccess: false,
      code: "5000",
      message: "서버 에러가 발생했습니다.",
    });
  }
});

app.listen(3000, () => console.log("Server is running at http://localhost:3000"));