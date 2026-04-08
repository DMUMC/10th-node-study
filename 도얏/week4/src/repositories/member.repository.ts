import { db } from '../db/index.js'
import type { Member, MemberMission, PageResult } from '../types/index.js'

export const memberRepository = {
  findByEmail: (email: string): Member | undefined =>
    db.members.find((m) => m.email === email),

  findById: (id: number): Member | undefined =>
    db.members.find((m) => m.id === id),

  save: (member: Omit<Member, 'id' | 'point' | 'createdAt'>): Member => {
    const newMember: Member = {
      ...member,
      id: db.nextMemberId(),
      point: 0,
      createdAt: new Date().toISOString(),
    }
    db.members.push(newMember)
    return newMember
  },

  findMissionsByMemberId: (
    memberId: number,
    status: string | undefined,
    page: string | undefined,
    size: string | undefined,
  ): PageResult<MemberMission> => {
    let missions = db.memberMissions.filter((mm) => mm.memberId === memberId)

    if (status) {
      missions = missions.filter((mm) => mm.status === status)
    }

    const pageNum = parseInt(page ?? '1', 10)
    const sizeNum = parseInt(size ?? '10', 10)
    const totalCount = missions.length
    const totalPages = Math.max(1, Math.ceil(totalCount / sizeNum))
    const start = (pageNum - 1) * sizeNum
    const paged = missions.slice(start, start + sizeNum)

    return { missions: paged, totalPages, currentPage: pageNum, isLast: pageNum >= totalPages }
  },
}
