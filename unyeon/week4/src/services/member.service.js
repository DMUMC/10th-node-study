import { memberRepository } from '../repositories/member.repository.js'

export const memberService = {
  signUp: (body) => {
    // TODO: DB 연동 후 실제 로직 구현
    return { memberId: 1, name: body.name, nickname: body.nickname }
  },

  getMyPage: (memberId) => {
    // TODO: DB 연동 후 실제 로직 구현
    return { memberId, name: '홍길동', nickname: '길동이', point: 0 }
  },

  getMyMissions: (memberId, status, page, size) => {
    // TODO: DB 연동 후 실제 로직 구현
    return { missions: [], totalPages: 0, currentPage: page || 0, isLast: true }
  }
}
