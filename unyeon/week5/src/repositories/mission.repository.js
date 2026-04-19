import { pool } from '../db.config.js'

// 미션 존재 확인
export const existsMission = async (missionId) => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM mission WHERE id = ?) AS isExist;`,
      [missionId],
    )
    return rows[0].isExist === 1
  } catch (err) {
    throw new Error(`미션 조회 중 오류가 발생했습니다. (${err})`)
  } finally {
    conn.release()
  }
}

// 미션 생성
export const addMission = async (data) => {
  const conn = await pool.getConnection()
  try {
    const [result] = await conn.query(
      `INSERT INTO mission (store_id, title, reward, spec, dead_line)
       VALUES (?, ?, ?, ?, ?);`,
      [data.storeId, data.title, data.reward, data.spec, data.deadLine],
    )
    return result.insertId
  } catch (err) {
    throw new Error(`미션 생성 중 오류가 발생했습니다. (${err})`)
  } finally {
    conn.release()
  }
}

// id로 미션 단건 조회
export const getMissionById = async (missionId) => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query(
      `SELECT * FROM mission WHERE id = ?;`,
      [missionId],
    )
    return rows.length === 0 ? null : rows[0]
  } catch (err) {
    throw new Error(`미션 조회 중 오류가 발생했습니다. (${err})`)
  } finally {
    conn.release()
  }
}

// 이미 도전 중인 미션인지 확인
export const existsMemberMission = async (memberId, missionId) => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query(
      `SELECT EXISTS(
         SELECT 1 FROM member_mission WHERE member_id = ? AND mission_id = ?
       ) AS isExist;`,
      [memberId, missionId],
    )
    return rows[0].isExist === 1
  } catch (err) {
    throw new Error(`미션 도전 여부 확인 중 오류가 발생했습니다. (${err})`)
  } finally {
    conn.release()
  }
}

// 미션 도전 추가 (member_mission INSERT)
export const addMemberMission = async (memberId, missionId) => {
  const conn = await pool.getConnection()
  try {
    await conn.query(
      `INSERT INTO member_mission (member_id, mission_id, status)
       VALUES (?, ?, 'CHALLENGING');`,
      [memberId, missionId],
    )
    const [rows] = await conn.query(
      `SELECT * FROM member_mission WHERE member_id = ? AND mission_id = ?;`,
      [memberId, missionId],
    )
    return rows[0]
  } catch (err) {
    throw new Error(`미션 도전 추가 중 오류가 발생했습니다. (${err})`)
  } finally {
    conn.release()
  }
}
