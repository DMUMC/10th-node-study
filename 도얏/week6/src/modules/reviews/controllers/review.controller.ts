import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ReviewCreateRequest } from '../dtos/review.dto.js'
import { createReview, listUserReviews } from '../services/review.service.js'

// GET /api/v1/users/:userId/reviews
export const handleListUserReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params['userId'] ?? '0', 10)
    const cursor = typeof req.query['cursor'] === 'string' ? parseInt(req.query['cursor'], 10) : 0
    res.status(200).json(await listUserReviews(userId, cursor))
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/stores/:storeId/reviews
export const handleCreateReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const storeId = parseInt(req.params['storeId'] ?? '0', 10)
    const result = await createReview(storeId, req.body as ReviewCreateRequest)
    res.status(StatusCodes.CREATED).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}
