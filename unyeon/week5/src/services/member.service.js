import bcrypt from 'bcrypt'
import {
  addMember,
  getMemberById,
  findMemberByEmail,
} from '../repositories/member.repository.js'
import { responseFromMember } from '../dtos/member.dto.js'
import { DuplicateEmailError, BadRequestError } from '../errors.js'

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
