import bcrypt from 'bcryptjs'
import {
  MemberLoginRequest,
  MemberSignUpRequest,
  bodyToMember,
  responseFromMember,
} from '../dtos/memberDto.js'
import { addUser, getUser, getUserByEmail } from '../repositories/memberRepository.js'
import { BaseError } from '../../../utils/errors.js'
import { ErrorCode } from '../../../utils/errorCode.js'

export const signUp = async (data: MemberSignUpRequest) => {
  // TSOA required 검증 이후에도 빈 문자열 입력은 서비스에서 한 번 더 방어합니다.
  if (!data.name || !data.email || !data.password) {
    throw new BaseError(ErrorCode.MEMBER_REQUIRED_FIELD)
  }

  const existingUser = await getUserByEmail(data.email)
  if (existingUser) {
    throw new BaseError(ErrorCode.DUPLICATE_EMAIL)
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)
  const memberData = bodyToMember(data)
  const memberId = await addUser({ ...memberData, password: hashedPassword })
  const member = await getUser(memberId)

  if (!member) {
    throw new BaseError(ErrorCode.USER_NOT_FOUND)
  }

  return responseFromMember(member)
}

export const login = async (data: MemberLoginRequest) => {
  // TSOA required 검증 이후에도 빈 문자열 입력은 서비스에서 한 번 더 방어합니다.
  if (!data.email || !data.password) {
    throw new BaseError(ErrorCode.MEMBER_REQUIRED_FIELD)
  }

  const member = await getUserByEmail(data.email)
  if (!member?.password) {
    throw new BaseError(ErrorCode.AUTH_INVALID_CREDENTIALS)
  }

  const isPasswordMatched = await bcrypt.compare(data.password, member.password)
  if (!isPasswordMatched) {
    throw new BaseError(ErrorCode.AUTH_INVALID_CREDENTIALS)
  }

  return responseFromMember(member)
}
