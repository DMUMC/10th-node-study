import { db } from '../db/index.js'
import type { Mission, MemberMission } from '../types/index.js'

export const missionRepository = {
  findById: (id: number): Mission | undefined =>
    db.missions.find((m) => m.id === id),

  findMemberMission: (memberId: number, missionId: number): MemberMission | undefined =>
    db.memberMissions.find((mm) => mm.memberId === memberId && mm.missionId === missionId),

  saveMemberMission: (memberMission: Omit<MemberMission, 'id' | 'createdAt'>): MemberMission => {
    const newMM: MemberMission = {
      ...memberMission,
      id: db.nextMemberMissionId(),
      createdAt: new Date().toISOString(),
    }
    db.memberMissions.push(newMM)
    return newMM
  },
}
