import express from 'express'
import { handleCreateReview } from '../controllers/store.controller.js'
import { handleCreateMission } from '../controllers/mission.controller.js'

export const storeRouter = express.Router()

// 2. POST /api/v1/stores/:storeId/reviews  (가게에 리뷰 추가)
storeRouter.post('/:storeId/reviews', handleCreateReview)

// 3. POST /api/v1/stores/:storeId/missions  (가게에 미션 추가)
storeRouter.post('/:storeId/missions', handleCreateMission)
