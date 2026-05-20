import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { StoreCreateRequest } from '../dtos/store.dto.js'
import { createStore } from '../services/store.service.js'

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
