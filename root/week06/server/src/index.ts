import "dotenv/config";
import express from "express";
import * as repo from "./repository";

const app = express();
app.use(express.json());

// 내가 작성한 리뷰 목록
app.get("/api/users/:userId/reviews", async (req, res) => {
  const reviews = await repo.getMyReviews(Number(req.params.userId));
  res.json({ isSuccess: true, result: reviews });
});

// 특정 가게의 미션 목록
app.get("/api/stores/:storeId/missions", async (req, res) => {
  const missions = await repo.getStoreMissions(Number(req.params.storeId));
  res.json({ isSuccess: true, result: missions });
});

// 내가 진행 중인 미션 목록
app.get("/api/users/:userId/missions", async (req, res) => {
  const status = (req.query.status as string) ?? "IN_PROGRESS";
  const missions = await repo.getMyMissions(Number(req.params.userId), status);
  res.json({ isSuccess: true, result: missions });
});

// 미션 완료 처리
app.patch("/api/user-missions/:userMissionId/complete", async (req, res) => {
  const updated = await repo.completeMission(Number(req.params.userMissionId));
  res.json({ isSuccess: true, result: updated });
});

app.listen(3000, () => console.log("Server is running at http://localhost:3000"));