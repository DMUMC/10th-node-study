import dotenv from 'dotenv'
import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
import fs from 'fs'
import { RegisterRoutes } from './generated/routes.js'
import { errorMiddleware } from './middleware/error.middleware.js'

// 1. 환경 변수 설정 (가장 먼저 호출)
dotenv.config()

const app: Express = express()
const port = process.env.PORT ?? 3000

// 2. 미들웨어 설정
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 3. TSOA가 생성한 라우트 등록
const router = express.Router()
RegisterRoutes(router)
app.use('/api/v1', router)

// 4. Swagger UI 연결 (dist/swagger.json 이 존재할 때만)
const swaggerPath = path.resolve('dist/swagger.json')
if (fs.existsSync(swaggerPath)) {
  const swaggerFile = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'))
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
}

// 5. 전역 에러 핸들러 (반드시 라우터 등록 이후에 위치)
app.use(errorMiddleware)

// 6. 서버 시작
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
  console.log(`[docs]:   Swagger UI at http://localhost:${port}/docs`)
})
