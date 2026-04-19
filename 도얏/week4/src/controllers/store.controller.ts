import { Request, Response, NextFunction } from 'express'
import { storeService } from '../services/store.service.js'

export const storeController = {
  createReview: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const storeId = parseInt(String(req.params.storeId), 10)
      const result = storeService.createReview(storeId, req.memberId!, req.body)
      res.status(201).json({ success: true, code: 'S201', message: '리뷰가 등록되었습니다.', data: result })
    } catch (e) {
      next(e)
    }
  },
}
