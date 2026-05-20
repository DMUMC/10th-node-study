import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../../../db.config.js'

// 이메일 중복 확인
export const findMemberByEmail = async (email: string): Promise<RowDataPacket | null> => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT id FROM member WHERE email = ?',
      [email],
    )
    return rows[0] ?? null
  } catch (err) {
    throw new Error(`DB 오류: ${err}`)
  } finally {
    conn.release()
  }
}

// 회원 추가
export const addMember = async (data: {
  name: string
  nickname: string
  email: string | null
  hashedPassword: string | null
  phoneNum: string | null
  birth: Date | null
  gender: string | null
  address: string | null
  specAddress: string | null
}): Promise<number> => {
  const conn = await pool.getConnection()
  try {
    const [result] = await conn.query<ResultSetHeader>(
      `INSERT INTO member
         (name, nickname, email, password, phone_num, birth, gender, address, spec_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.nickname,
        data.email,
        data.hashedPassword,
        data.phoneNum,
        data.birth,
        data.gender,
        data.address,
        data.specAddress,
      ],
    )
    return result.insertId
  } catch (err) {
    throw new Error(`DB 오류: ${err}`)
  } finally {
    conn.release()
  }
}

// 회원 조회
export const getMemberById = async (memberId: number): Promise<RowDataPacket | null> => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM member WHERE id = ?',
      [memberId],
    )
    return rows[0] ?? null
  } catch (err) {
    throw new Error(`DB 오류: ${err}`)
  } finally {
    conn.release()
  }
}
