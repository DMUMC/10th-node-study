import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../../../db.config.js'

// 가게 존재 여부 확인
export const findStoreById = async (storeId: number): Promise<RowDataPacket | null> => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM store WHERE id = ?',
      [storeId],
    )
    return rows[0] ?? null
  } catch (err) {
    throw new Error(`DB 오류: ${err}`)
  } finally {
    conn.release()
  }
}

// 가게 추가
export const addStore = async (data: {
  regionId: number
  foodCategoryId: number
  name: string
  description: string | null
  address: string
  lat: number | null
  lng: number | null
}): Promise<number> => {
  const conn = await pool.getConnection()
  try {
    const [result] = await conn.query<ResultSetHeader>(
      `INSERT INTO store (region_id, food_category_id, name, description, address, lat, lng)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
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
    throw new Error(`DB 오류: ${err}`)
  } finally {
    conn.release()
  }
}

// 방금 추가한 가게 정보 조회
export const getStoreById = async (storeId: number): Promise<RowDataPacket | null> => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM store WHERE id = ?',
      [storeId],
    )
    return rows[0] ?? null
  } catch (err) {
    throw new Error(`DB 오류: ${err}`)
  } finally {
    conn.release()
  }
}
