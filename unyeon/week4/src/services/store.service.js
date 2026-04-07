import { storeRepository } from '../repositories/store.repository.js'

export const storeService = {
  createReview: (storeId, memberId, body) => {
    // TODO: DB 연동 후 실제 로직 구현
    return { reviewId: 1, storeId, content: body.content, score: body.score }
  }
}
