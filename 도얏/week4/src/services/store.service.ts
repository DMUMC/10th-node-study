import { storeRepository } from '../repositories/store.repository.js'
import type { Review } from '../types/index.js'

const makeError = (message: string, status: number): Error & { status: number } => {
  const err = new Error(message) as Error & { status: number }
  err.status = status
  return err
}

export const storeService = {
  createReview: (storeId: number, memberId: number, body: Record<string, unknown>): Review => {
    const { content, score } = body as { content?: string; score?: number }

    if (!content || score === undefined) {
      throw makeError('내용(content)과 별점(score)을 입력해 주세요.', 400)
    }

    if (score < 1 || score > 5) {
      throw makeError('별점은 1~5 사이여야 합니다.', 400)
    }

    const store = storeRepository.findById(storeId)
    if (!store) {
      throw makeError('존재하지 않는 가게입니다.', 404)
    }

    return storeRepository.saveReview({ storeId, memberId, content, score })
  },
}
