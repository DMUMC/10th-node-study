// 미션 생성 요청 body → Mission 객체
export const bodyToMission = (storeId, body) => {
  return {
    storeId: Number(storeId),
    title: body.title,
    reward: Number(body.reward ?? 0),
    spec: body.spec ?? null,
    deadLine: body.deadLine ? new Date(body.deadLine) : null,
  }
}

// 미션 생성 응답 DTO
export const responseFromMission = (mission) => {
  return {
    id: mission.id,
    storeId: mission.store_id,
    title: mission.title,
    reward: mission.reward,
    spec: mission.spec,
    deadLine: mission.dead_line,
    createdAt: mission.created_at,
  }
}

// 미션 도전 응답 DTO
export const responseFromMemberMission = (mm) => {
  return {
    memberId: mm.member_id,
    missionId: mm.mission_id,
    status: mm.status,
    createdAt: mm.created_at,
  }
}
