import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../../../db.config.js'

// 미션 추가
export const addMission = async (data: {
  storeId: number
  title: string
  reward: number
  spec: string | null
  deadLine: Date | null
}): Promise<number> => {
  const conn = await pool.getConnection()
  try {
    const [result] = await conn.query<ResultSetHeader>(
      `INSERT INTO mission (store_id, title, reward, spec, dead_line)
       VALUES (?, ?, ?, ?, ?)`,
      [data.storeId, data.title, data.reward, data.spec, data.deadLine],
    )
    return result.insertId
  } catch (err) {
    throw new Error(`DB 오류: ${err}`)
  } finally {
    conn.release()
  }
}

// 미션 조회
export const getMissionById = async (missionId: number): Promise<RowDataPacket | null> => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM mission WHERE id = ?',
      [missionId],
    )
    return rows[0] ?? null
  } catch (err) {
    throw new Error(`DB 오류: ${err}`)
  } finally {
    conn.release()
  }
}

// 이미 도전 중인 미션인지 확인
export const findMemberMission = async (
  memberId: number,
  missionId: number,
): Promise<RowDataPacket | null> => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM member_mission
       WHERE member_id = ? AND mission_id = ?`,
      [memberId, missionId],
    )
    return rows[0] ?? null
  } catch (err) {
    throw new Error(`DB 오류: ${err}`)
  } finally {
    conn.release()
  }
}

// 미션 도전 추가
export const addMemberMission = async (
  memberId: number,
  missionId: number,
  status: string,
): Promise<number> => {
  const conn = await pool.getConnection()
  try {
    const [result] = await conn.query<ResultSetHeader>(
      `INSERT INTO member_mission (member_id, mission_id, status)
       VALUES (?, ?, ?)`,
      [memberId, missionId, status],
    )
    return result.insertId
  } catch (err) {
    throw new Error(`DB 오류: ${err}`)
  } finally {
    conn.release()
  }
}

// 방금 추가한 미션 도전 기록 조회
export const getMemberMissionById = async (
  memberMissionId: number,
): Promise<RowDataPacket | null> => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT * FROM member_mission WHERE id = ?',
      [memberMissionId],
    )
    return rows[0] ?? null
  } catch (err) {
    throw new Error(`DB 오류: ${err}`)
  } finally {
    conn.release()
  }
}
