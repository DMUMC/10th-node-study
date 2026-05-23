import bcrypt from 'bcryptjs'
import { MemberSignUpRequest, bodyToMember, responseFromMember } from '../dtos/member.dto.js'
import { addUser, getUser } from '../repositories/member.repository.js'
import { BaseError } from '../../../utils/errors.js'
import { ErrorCode } from '../../../utils/errorCode.js'

export const signUp = async (data: MemberSignUpRequest) => {
  if (!data.name || !data.nickname) {
    throw new BaseError(
      ErrorCode.MEMBER_REQUIRED_FIELD.message,
      ErrorCode.MEMBER_REQUIRED_FIELD.status,
      ErrorCode.MEMBER_REQUIRED_FIELD.code,
    )
  }

  const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : null

  const memberData = bodyToMember(data)
  const memberId = await addUser({ ...memberData, hashedPassword })

  if (memberId === null) {
    throw new BaseError(
      ErrorCode.DUPLICATE_EMAIL.message,
      ErrorCode.DUPLICATE_EMAIL.status,
      ErrorCode.DUPLICATE_EMAIL.code,
    )
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
