import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { StoreCreateRequest } from '../dtos/store.dto.js'
import { createStore, listStoreReviews } from '../services/store.service.js'
import { BaseResponse } from '../../../utils/response.js'

// POST /api/v1/stores
export const handleCreateStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await createStore(req.body as StoreCreateRequest)
    res.status(StatusCodes.CREATED).json(BaseResponse(result))
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/stores/:storeId/reviews
export const handleListStoreReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = parseInt(String(req.params['storeId'] ?? '0'), 10)
    const cursor = typeof req.query.cursor === 'string' ? parseInt(req.query.cursor, 10) : 0
    const result = await listStoreReviews(storeId, cursor)
    res.status(StatusCodes.OK).json(BaseResponse(result))
  } catch (err) {
    next(err)
  }
}
