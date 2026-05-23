// 미션 추가 요청 인터페이스
export interface MissionCreateRequest {
  /** 미션 제목 */
  title: string
  /**
   * 포인트 보상
   * @example 500
   */
  reward: number
  /** 미션 상세 설명 */
  spec?: string
  /**
   * 마감일 (YYYY-MM-DD)
   * @example "2026-12-31"
   */
  deadLine?: string
}

// 미션 도전 요청 인터페이스
export interface MissionChallengeRequest {
  /**
   * 도전할 회원 ID
   * @example 1
   */
  memberId: number
  /**
   * 미션 상태
   * @example "CHALLENGING"
   */
  status: 'CHALLENGING' | 'COMPLETE'
}

// 미션 생성 응답 인터페이스
export interface MissionCreateResponse {
  /** 생성된 미션 ID */
  missionId: number
  /** 가게 ID */
  storeId: number
  /** 미션 제목 */
  title: string
  /** 포인트 보상 */
  reward: number
  /** 미션 설명 */
  spec: string | null
  /** 마감일 */
  deadLine: Date | null
}

// 미션 도전 응답 인터페이스
export interface MissionChallengeResponse {
  /** 회원-미션 매핑 ID */
  memberMissionId: number
  /** 회원 ID */
  memberId: number
  /** 미션 ID */
  missionId: number
  /** 미션 상태 */
  status: string
}

// 진행 중 미션 목록 응답 인터페이스
export interface OngoingMissionListResponse {
  data: MissionCreateResponse[]
  pagination: {
    /** 다음 페이지 커서 */
    cursor: number | null
  }
}

// 가게 미션 목록 응답 인터페이스
export interface StoreMissionListResponse {
  data: MissionCreateResponse[]
  pagination: {
    cursor: number | null
  }
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
