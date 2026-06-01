import bcrypt from 'bcryptjs'
import {
  MemberSignUpRequest,
  UserUpdateRequest,
  bodyToMember,
  bodyToUserUpdate,
  responseFromMember,
  responseFromUserUpdate,
} from '../dtos/memberDto.js'
import { addUser, getUser, updateUser } from '../repositories/memberRepository.js'
import { BaseError } from '../../../utils/errors.js'
import { ErrorCode } from '../../../utils/errorCode.js'

// 회원가입
export const signUp = async (data: MemberSignUpRequest) => {
  // TSOA required 검증 이후에도 빈 문자열 입력은 서비스에서 한 번 더 방어합니다.
  if (!data.name) {
    throw new BaseError(ErrorCode.MEMBER_REQUIRED_FIELD)
  }

  const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : null

  const memberData = bodyToMember(data)
  const memberId = await addUser({ ...memberData, ...(hashedPassword ? { password: hashedPassword } : {}) })

  if (memberId === null) {
    throw new BaseError(ErrorCode.DUPLICATE_EMAIL)
  }

  const member = await getUser(memberId)
  return responseFromMember(member)
}

// 사용자 정보 수정 (미션 2: Google 로그인으로 가입된 사용자가 빈 필드 채우기)
export const updateUserInfo = async (userId: number, data: UserUpdateRequest) => {
  const updateData = bodyToUserUpdate(data)
  const updated = await updateUser(userId, updateData)
  return responseFromUserUpdate(updated)
}
