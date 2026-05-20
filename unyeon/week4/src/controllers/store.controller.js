import { storeService } from '../services/store.service.js'

export const storeController = {
  createReview: (req, res) => {
    const { storeId } = req.params
    const result = storeService.createReview(storeId, 1, req.body) // TODO: 토큰에서 memberId 추출
    res.status(201).json({ success: true, code: 'S201', message: '리뷰가 등록되었습니다.', data: result })
  }
}
