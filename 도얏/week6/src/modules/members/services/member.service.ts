import bcrypt from 'bcryptjs'
import { MemberSignUpRequest, bodyToMember, responseFromMember } from '../dtos/member.dto.js'
import {
  addUser,
  getUser,
} from '../repositories/member.repository.js'

const makeError = (message: string, status: number): Error & { status: number } => {
  const err = new Error(message) as Error & { status: number }
  err.status = status
  return err
}

export const signUp = async (data: MemberSignUpRequest) => {
  // 필수값 검증
  if (!data.name || !data.nickname) {
    throw makeError('name과 nickname은 필수 입력값입니다.', 400)
  }

  // 비밀번호 해싱 (password가 있는 경우에만)
  const hashedPassword = data.password
    ? await bcrypt.hash(data.password, 10)
    : null

  const memberData = bodyToMember(data)
  const memberId = await addUser({ ...memberData, hashedPassword })

  if (memberId === null) {
    throw makeError('이미 존재하는 이메일입니다.', 409)
  }

  const member = await getUser(memberId)

  return responseFromMember(member as {
    id: number
    name: string
    nickname: string
    email: string | null
    phone_num: string | null
    status: string
  })
}
