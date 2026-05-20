import express from 'express'
import { storeController } from '../controllers/store.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const storeRouter = express.Router()

storeRouter.post('/:storeId/reviews', authMiddleware, storeController.createReview)
