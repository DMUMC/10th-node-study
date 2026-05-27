export enum MissionStatus {
  CHALLENGING = 'CHALLENGING',
  COMPLETE = 'COMPLETE',
}

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
  status?: MissionStatus
}

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

export interface MissionChallengeResponse {
  /** 회원-미션 매핑 ID */
  memberMissionId: number
  /** 회원 ID */
  memberId: number
  /** 미션 ID */
  missionId: number
  /** 미션 상태 */
  status: MissionStatus
}

export interface OngoingMissionListResponse {
  data: MissionChallengeResponse[]
  pagination: {
    /** 다음 페이지 커서 */
    cursor: number | null
  }
}

export interface StoreMissionListResponse {
  data: MissionCreateResponse[]
  pagination: {
    cursor: number | null
  }
}

export const bodyToMission = (body: MissionCreateRequest) => {
  return {
    title: body.title,
    reward: body.reward,
    spec: body.spec ?? null,
    deadLine: body.deadLine ? new Date(body.deadLine) : null,
  }
}

export const responseFromMission = (mission: {
  id: number
  storeId: number
  title: string
  reward: number
  spec: string | null
  deadLine: Date | null
}): MissionCreateResponse => {
  return {
    missionId: mission.id,
    storeId: mission.storeId,
    title: mission.title,
    reward: mission.reward,
    spec: mission.spec,
    deadLine: mission.deadLine,
  }
}

export const responseFromMemberMission = (mm: {
  id: number
  memberId: number
  missionId: number
  status: string
}): MissionChallengeResponse => {
  return {
    memberMissionId: mm.id,
    memberId: mm.memberId,
    missionId: mm.missionId,
    status: mm.status as MissionStatus,
  }
}
