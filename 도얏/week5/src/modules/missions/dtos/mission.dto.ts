// 미션 추가 요청 인터페이스
export interface MissionCreateRequest {
  title: string
  reward: number
  spec?: string
  deadLine?: string // "YYYY-MM-DD"
}

// 미션 도전 요청 인터페이스
export interface MissionChallengeRequest {
  memberId: number
}

// req.body → 내부 데이터로 변환 (미션 추가)
export const bodyToMission = (body: MissionCreateRequest) => {
  return {
    title: body.title,
    reward: body.reward,
    spec: body.spec ?? null,
    deadLine: body.deadLine ? new Date(body.deadLine) : null,
  }
}

// DB 결과 → 응답 형태로 변환 (미션)
export const responseFromMission = (mission: {
  id: number
  store_id: number
  title: string
  reward: number
  spec: string | null
  dead_line: Date | null
}) => {
  return {
    missionId: mission.id,
    storeId: mission.store_id,
    title: mission.title,
    reward: mission.reward,
    spec: mission.spec,
    deadLine: mission.dead_line,
  }
}

// DB 결과 → 응답 형태로 변환 (미션 도전)
export const responseFromMemberMission = (mm: {
  id: number
  member_id: number
  mission_id: number
  status: string
}) => {
  return {
    memberMissionId: mm.id,
    memberId: mm.member_id,
    missionId: mm.mission_id,
    status: mm.status,
  }
}
