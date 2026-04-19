import { pool } from '../db.config.js'

// 지역 존재 확인
export const existsRegion = async (regionId) => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM region WHERE id = ?) AS isExist;`,
      [regionId],
    )
    return rows[0].isExist === 1
  } catch (err) {
    throw new Error(`지역 조회 중 오류가 발생했습니다. (${err})`)
  } finally {
    conn.release()
  }
}

// 가게 존재 확인
export const existsStore = async (storeId) => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM store WHERE id = ?) AS isExist;`,
      [storeId],
    )
    return rows[0].isExist === 1
  } catch (err) {
    throw new Error(`가게 조회 중 오류가 발생했습니다. (${err})`)
  } finally {
    conn.release()
  }
}

// 가게 생성
export const addStore = async (data) => {
  const conn = await pool.getConnection()
  try {
    const [result] = await conn.query(
      `INSERT INTO store
         (region_id, food_category_id, name, description, address, lat, lng)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        data.regionId,
        data.foodCategoryId,
        data.name,
        data.description,
        data.address,
        data.lat,
        data.lng,
      ],
    )
    return result.insertId
  } catch (err) {
    throw new Error(`가게 생성 중 오류가 발생했습니다. (${err})`)
  } finally {
    conn.release()
  }
}

// id로 가게 단건 조회
export const getStoreById = async (storeId) => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query(
      `SELECT * FROM store WHERE id = ?;`,
      [storeId],
    )
    return rows.length === 0 ? null : rows[0]
  } catch (err) {
    throw new Error(`가게 조회 중 오류가 발생했습니다. (${err})`)
  } finally {
    conn.release()
  }
}

// 리뷰 생성
export const addReview = async (data) => {
  const conn = await pool.getConnection()
  try {
    const [result] = await conn.query(
      `INSERT INTO review (member_id, store_id, content, score)
       VALUES (?, ?, ?, ?);`,
      [data.memberId, data.storeId, data.content, data.score],
    )
    return result.insertId
  } catch (err) {
    throw new Error(`리뷰 생성 중 오류가 발생했습니다. (${err})`)
  } finally {
    conn.release()
  }
}

// id로 리뷰 단건 조회
export const getReviewById = async (reviewId) => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query(
      `SELECT * FROM review WHERE id = ?;`,
      [reviewId],
    )
    return rows.length === 0 ? null : rows[0]
  } catch (err) {
    throw new Error(`리뷰 조회 중 오류가 발생했습니다. (${err})`)
  } finally {
    conn.release()
  }
}
