import { db } from '../db/index.js'
import type { Store, Review } from '../types/index.js'

export const storeRepository = {
  findById: (id: number): Store | undefined =>
    db.stores.find((s) => s.id === id),

  saveReview: (review: Omit<Review, 'id' | 'createdAt'>): Review => {
    const newReview: Review = {
      ...review,
      id: db.nextReviewId(),
      createdAt: new Date().toISOString(),
    }
    db.reviews.push(newReview)
    return newReview
  },
}
