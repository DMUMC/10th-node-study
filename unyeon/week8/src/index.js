import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerAutogen from 'swagger-autogen'

import { memberRouter } from './routes/member.route.js'
import { regionRouter } from './routes/region.route.js'
import { storeRouter } from './routes/store.route.js'
import { missionRouter } from './routes/mission.route.js'

import { responseHandler } from './middlewares/response.middleware.js'
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/error.middleware.js'

dotenv.config()

// BigInt JSON 직렬화 처리
BigInt.prototype.toJSON = function () {
  return this.toString()
}

const app = express()
const port = process.env.PORT || 3000

// ===== 전역 미들웨어 =====
app.use(cors())
app.use(morgan('dev'))        // HTTP 요청 로그
app.use(cookieParser())       // 쿠키 파싱
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(responseHandler)      // res.success / res.error 주입

// ===== Swagger =====
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup({}, {
    swaggerOptions: {
      url: '/openapi.json',
    },
  })
)

app.get('/openapi.json', async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: '3.0.0',
    disableLogs: true,
    writeOutputFile: false,
  }
  const outputFile = '/dev/null'
  const routes = ['./src/index.js']
  const doc = {
    info: {
      title: 'UMC 10th Node.js',
      description: 'UMC 10th Node.js 스터디 API 문서입니다.',
    },
    host: 'localhost:3000',
    basePath: '/api/v1',
  }

  const result = await swaggerAutogen(options)(outputFile, routes, doc)
  res.json(result ? result.data : null)
})

// ===== 헬스 체크 =====
app.get('/', (req, res) => {
  res.send('UMC 8주차 서버 실행 중!')
})

// ===== API 라우터 =====
app.use('/api/v1/members', memberRouter)
app.use('/api/v1/regions', regionRouter)
app.use('/api/v1/stores', storeRouter)
app.use('/api/v1/missions', missionRouter)

// ===== 404 + 에러 핸들러 (항상 마지막) =====
app.use(notFoundHandler)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
