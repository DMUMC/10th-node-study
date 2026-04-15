import { pool } from '../db.config.js'

// 이메일로 사용자 조회
export const findMemberByEmail = async (email) => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query(
      `SELECT * FROM member WHERE email = ?;`,
      [email],
    )
    return rows.length === 0 ? null : rows[0]
  } catch (err) {
    throw new Error(`회원 조회 중 오류가 발생했습니다. (${err})`)
  } finally {
    conn.release()
  }
}

// 회원 추가 (비밀번호는 이미 해싱된 값으로 들어옴)
export const addMember = async (data) => {
  const conn = await pool.getConnection()
  try {
    const [exists] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM member WHERE email = ?) AS isExist;`,
      [data.email],
    )
    if (exists[0].isExist) return null

    const [result] = await conn.query(
      `INSERT INTO member
         (email, password, name, nickname, gender, birth, phone_num, address, spec_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        data.email,
        data.password,
        data.name,
        data.nickname,
        data.gender,
        data.birth,
        data.phoneNum,
        data.address,
        data.specAddress,
      ],
    )
    return result.insertId
  } catch (err) {
    throw new Error(`회원 추가 중 오류가 발생했습니다. (${err})`)
  } finally {
    conn.release()
  }
}

// id로 회원 단건 조회
export const getMemberById = async (memberId) => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query(
      `SELECT * FROM member WHERE id = ?;`,
      [memberId],
    )
    return rows.length === 0 ? null : rows[0]
  } catch (err) {
    throw new Error(`회원 조회 중 오류가 발생했습니다. (${err})`)
  } finally {
    conn.release()
  }
}
