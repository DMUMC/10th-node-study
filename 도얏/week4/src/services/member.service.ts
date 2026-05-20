import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { memberRepository } from '../repositories/member.repository.js'
import type { MemberMission, PageResult } from '../types/index.js'

const JWT_SECRET = process.env.JWT_SECRET ?? 'umc-week4-secret'

const makeError = (message: string, status: number): Error & { status: number } => {
  const err = new Error(message) as Error & { status: number }
  err.status = status
  return err
}

export const memberService = {
  signUp: async (body: Record<string, unknown>) => {
    const { name, nickname, email, password } = body as {
      name?: string
      nickname?: string
      email?: string
      password?: string
    }

    if (!name || !nickname || !email || !password) {
      throw makeError('필수 항목(name, nickname, email, password)을 모두 입력해 주세요.', 400)
    }

    if (memberRepository.findByEmail(email)) {
      throw makeError('이미 사용 중인 이메일입니다.', 409)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const member = memberRepository.save({ name, nickname, email, password: hashedPassword })
    const token = jwt.sign({ memberId: member.id }, JWT_SECRET, { expiresIn: '7d' })

    return { memberId: member.id, name: member.name, nickname: member.nickname, token }
  },

  login: async (body: Record<string, unknown>) => {
    const { email, password } = body as { email?: string; password?: string }

    if (!email || !password) {
      throw makeError('이메일과 비밀번호를 입력해 주세요.', 400)
    }

    const member = memberRepository.findByEmail(email)
    if (!member) {
      throw makeError('이메일 또는 비밀번호가 올바르지 않습니다.', 401)
    }

    const isValid = await bcrypt.compare(password, member.password)
    if (!isValid) {
      throw makeError('이메일 또는 비밀번호가 올바르지 않습니다.', 401)
    }

    const token = jwt.sign({ memberId: member.id }, JWT_SECRET, { expiresIn: '7d' })
    return { memberId: member.id, name: member.name, nickname: member.nickname, token }
  },

  getMyPage: (memberId: number) => {
    const member = memberRepository.findById(memberId)
    if (!member) {
      throw makeError('회원을 찾을 수 없습니다.', 404)
    }
    const { password: _, ...safeData } = member
    return safeData
  },

  getMyMissions: (
    memberId: number,
    status: string | undefined,
    page: string | undefined,
    size: string | undefined,
  ): PageResult<MemberMission> => {
    return memberRepository.findMissionsByMemberId(memberId, status, page, size)
  },
}
