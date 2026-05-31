import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
  addMember,
  getMemberById,
  findMemberByEmail,
  getMemberReviews,
  getMemberChallengingMissions,
  completeMemberMission,
  updateMember,
} from '../repositories/member.repository.js'
import { responseFromMember } from '../dtos/member.dto.js'
import { DuplicateEmailError, BadRequestError, MemberNotFoundError } from '../errors.js'

const BCRYPT_SALT_ROUNDS = 10

// 회원가입: 비밀번호 해싱 포함
export const memberSignUp = async (data) => {
  if (!data.email || !data.password || !data.name || !data.nickname) {
    throw new BadRequestError('필수 항목이 누락되었습니다.', {
      required: ['email', 'password', 'name', 'nickname'],
    })
  }

  // 이메일 중복 검증
  const existing = await findMemberByEmail(data.email)
  if (existing) {
    throw new DuplicateEmailError(data.email)
  }

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS)

  const newMemberId = await addMember({
    ...data,
    password: hashedPassword,
  })

  if (newMemberId === null) {
    throw new DuplicateEmailError(data.email)
  }

  const newMember = await getMemberById(newMemberId)
  return responseFromMember(newMember)
}

// 내가 작성한 리뷰 목록
export const getMyReviews = async (memberId, cursor) => {
  const member = await getMemberById(memberId)
  if (!member) throw new MemberNotFoundError(memberId)

  const reviews = await getMemberReviews(memberId, cursor)
  return {
    data: reviews.map((r) => ({
      id: r.id,
      storeName: r.store.name,
      content: r.content,
      score: r.score,
      createdAt: r.createdAt,
    })),
    nextCursor: reviews.length === 10 ? reviews[reviews.length - 1].id : null,
  }
}

// 내가 진행 중인 미션 목록 (offset 페이지네이션)
export const getMyChallengingMissions = async (memberId, page) => {
  const member = await getMemberById(memberId)
  if (!member) throw new MemberNotFoundError(memberId)

  const missions = await getMemberChallengingMissions(memberId, page)
  return {
    data: missions.map((mm) => ({
      memberId: mm.memberId.toString(),
      missionId: mm.missionId.toString(),
      storeName: mm.mission.store.name,
      title: mm.mission.title,
      reward: mm.mission.reward,
      status: mm.status,
      createdAt: mm.createdAt,
    })),
    hasNext: missions.length === 10,
  }
}

// 진행 중인 미션 → 완료 처리 (memberId + missionId)
export const finishMission = async (memberId, missionId) => {
  return completeMemberMission(memberId, missionId)
}

// 로그인 (이메일 + 비밀번호 검증 → JWT 발급)
export const memberLogin = async ({ email, password }) => {
  if (!email || !password) {
    throw new BadRequestError('이메일과 비밀번호를 입력해주세요.')
  }

  const member = await findMemberByEmail(email)
  if (!member) {
    throw new BadRequestError('이메일 또는 비밀번호가 올바르지 않습니다.')
  }

  const isMatch = await bcrypt.compare(password, member.password)
  if (!isMatch) {
    throw new BadRequestError('이메일 또는 비밀번호가 올바르지 않습니다.')
  }

  const token = jwt.sign(
    { id: member.id.toString(), email: member.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  return {
    accessToken: token,
    member: responseFromMember(member),
  }
}

// 회원 정보 수정
export const updateMemberInfo = async (memberId, data) => {
  const member = await getMemberById(BigInt(memberId))
  if (!member) throw new MemberNotFoundError(memberId)

  const updated = await updateMember(memberId, data)
  return responseFromMember(updated)
}
