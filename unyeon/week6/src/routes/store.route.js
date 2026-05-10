import express from 'express'
import {
  handleCreateReview,
  handleCreateStore,
  handleGetStoreMissions,
} from '../controllers/store.controller.js'
import { handleCreateMission } from '../controllers/mission.controller.js'

export const storeRouter = express.Router()

// POST /api/v1/stores/:storeId/reviews   (가게에 리뷰 추가)
storeRouter.post('/:storeId/reviews', handleCreateReview)

// POST /api/v1/stores/:storeId/missions  (가게에 미션 추가)
storeRouter.post('/:storeId/missions', handleCreateMission)

// GET  /api/v1/stores/:storeId/missions  (특정 가게의 미션 목록)
storeRouter.get('/:storeId/missions', handleGetStoreMissions)
