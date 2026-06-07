import dotenv from 'dotenv'
import express, { Express } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import passport from 'passport'
import path from 'path'
import fs from 'fs'
import { RegisterRoutes } from './generated/routes.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'
import { googleStrategy, jwtStrategy } from './authConfig.js'

// 1. 환경 변수 설정 (가장 먼저 호출)
dotenv.config()

const app: Express = express()
const port = process.env.PORT ?? 3000

// 2. Passport 전략 등록
passport.use(googleStrategy)
passport.use(jwtStrategy)

// 3. 미들웨어 설정
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())

// 4. OAuth 라우트 (TSOA 컨트롤러 밖에서 직접 등록)
// Google 로그인 시작 → Google 로그인 화면으로 리다이렉트
app.get('/oauth2/login/google', passport.authenticate('google', { session: false }))

// Google 로그인 콜백 → Access/Refresh 토큰 발급
app.get(
  '/oauth2/callback/google',
  passport.authenticate('google', { session: false, failureRedirect: '/login-failed' }),
  (req, res) => {
    // googleStrategy의 cb(null, tokens) 결과가 req.user 에 담김
    res.status(200).json({
      isSuccess: true,
      code: 'COMMON200',
      message: 'Google 로그인 성공',
      result: req.user,
    })
  },
)

app.get('/login-failed', (_req, res) => {
  res.status(401).json({ isSuccess: false, code: 'AUTH4001', message: 'Google 로그인에 실패했습니다.' })
})

// 5. TSOA가 생성한 라우트 등록
const router = express.Router()
RegisterRoutes(router)
app.use('/api/v1', router)

// 6. Swagger UI 연결 (dist/swagger.json 이 존재할 때만)
const swaggerPath = path.resolve('dist/swagger.json')
if (fs.existsSync(swaggerPath)) {
  const swaggerFile = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'))
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
}

// 7. 전역 에러 핸들러 (반드시 라우터 등록 이후에 위치)
app.use(errorMiddleware)

// 8. 서버 시작
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
  console.log(`[docs]:   Swagger UI at http://localhost:${port}/docs`)
  console.log(`[oauth]:  Google Login at http://localhost:${port}/oauth2/login/google`)
})
