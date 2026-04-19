import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import cors from 'cors'

// 컨트롤러 import
import { handleCreateStore } from './modules/stores/controllers/store.controller.js'
import { handleCreateReview } from './modules/reviews/controllers/review.controller.js'
import { handleCreateMission, handleChallengeMission } from './modules/missions/controllers/mission.controller.js'
import { handleSignUp } from './modules/members/controllers/member.controller.js'

// 에러 미들웨어 import
import { errorMiddleware } from './middleware/error.middleware.js'

// 1. 환경 변수 설정 (가장 먼저 호출)
dotenv.config()

const app: Express = express()
const port = process.env.PORT ?? 3000

// 2. 미들웨어 설정
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 3. 라우터 등록
app.get('/', (_req: Request, res: Response) => {
  res.send('UMC 5주차 서버 실행 중!')
})

// 회원
app.post('/api/v1/members/signup', handleSignUp)

// 가게
app.post('/api/v1/stores', handleCreateStore)
app.post('/api/v1/stores/:storeId/reviews', handleCreateReview)
app.post('/api/v1/stores/:storeId/missions', handleCreateMission)

// 미션
app.post('/api/v1/missions/:missionId/challenge', handleChallengeMission)

// 4. 전역 에러 핸들러 (반드시 라우터 등록 이후에 위치)
app.use(errorMiddleware)

// 5. 서버 시작
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
