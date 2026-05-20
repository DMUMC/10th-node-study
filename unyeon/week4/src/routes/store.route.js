import express from 'express'
import { storeController } from '../controllers/store.controller.js'

export const storeRouter = express.Router()

storeRouter.post('/:storeId/reviews', storeController.createReview)
