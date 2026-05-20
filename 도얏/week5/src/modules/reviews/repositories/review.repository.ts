import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../../../db.config.js'

// 리뷰 추가
export const addReview = async (data: {
  memberId: number
  storeId: number
  content: string
  score: number
}): Promise<number> => {
  const conn = await pool.getConnection()
  try {
    const [result] = await conn.query<ResultSetHeader>(
      `INSERT INTO review (member_id, store_id, content, score)
       VALUES (?, ?, ?, ?)`,
      [data.memberId, data.storeId, data.content, data.score],
    )
    return result.insertId
  } catch (err) {
    throw new Error(`DB 오류: ${err}`)
  } finally {
    conn.release()
  }
}

// 방금 추가한 리뷰 조회
export const getReviewById = async (reviewId: number): Promise<RowDataPacket | null> => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM review WHERE id = ?',
      [reviewId],
    )
    return rows[0] ?? null
  } catch (err) {
    throw new Error(`DB 오류: ${err}`)
  } finally {
    conn.release()
  }
}
