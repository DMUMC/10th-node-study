import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { StoreCreateRequest } from '../dtos/store.dto.js'
import { createStore, listStoreReviews } from '../services/store.service.js'

// POST /api/v1/stores
export const handleCreateStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await createStore(req.body as StoreCreateRequest)
    res.status(StatusCodes.CREATED).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/stores/:storeId/reviews
export const handleListStoreReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = parseInt(req.params.storeId, 10)
    const cursor = typeof req.query.cursor === 'string' ? parseInt(req.query.cursor, 10) : 0
    res.status(200).json(await listStoreReviews(storeId, cursor))
  } catch (err) {
    next(err)
  }
}
