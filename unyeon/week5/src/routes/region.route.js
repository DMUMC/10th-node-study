import express from 'express'
import { handleCreateStore } from '../controllers/store.controller.js'

export const regionRouter = express.Router()

// 1. POST /api/v1/regions/:regionId/stores  (특정 지역에 가게 추가)
regionRouter.post('/:regionId/stores', handleCreateStore)
