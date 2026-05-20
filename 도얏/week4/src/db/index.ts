import type { Member, Store, Review, Mission, MemberMission } from '../types/index.js'

// 인메모리 DB (week5에서 실제 DB로 교체 예정)
let memberIdSeq = 1
let reviewIdSeq = 1
let missionIdSeq = 3
let memberMissionIdSeq = 1
let storeIdSeq = 3

export const db = {
  members: [] as Member[],

  stores: [
    { id: 1, name: '맛있는 식당', address: '서울시 강남구' },
    { id: 2, name: '카페 UMC', address: '서울시 마포구' },
  ] as Store[],

  reviews: [] as Review[],

  missions: [
    { id: 1, storeId: 1, title: '첫 방문 미션', reward: 500, deadline: '2026-12-31', missionSpec: '음식 주문 후 리뷰 남기기' },
    { id: 2, storeId: 2, title: '카페 방문 미션', reward: 300, deadline: '2026-12-31', missionSpec: '음료 주문하기' },
  ] as Mission[],

  memberMissions: [] as MemberMission[],

  nextMemberId: () => memberIdSeq++,
  nextReviewId: () => reviewIdSeq++,
  nextMissionId: () => missionIdSeq++,
  nextMemberMissionId: () => memberMissionIdSeq++,
  nextStoreId: () => storeIdSeq++,
}
