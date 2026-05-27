export interface MemberSignUpRequest {
  /** 회원 이름 */
  name: string
  /** 닉네임 */
  nickname?: string
  /**
   * 이메일
   * @example "test@example.com"
   */
  email: string
  /**
   * 비밀번호
   * @example "qwer1234!"
   */
  password: string
  /**
   * 전화번호
   * @example "010-1234-5678"
   */
  phoneNumber?: string
  /**
   * 생년월일 (YYYY-MM-DD)
   * @example "2000-01-01"
   */
  birth?: string
  /**
   * 성별
   * @example "FEMALE"
   */
  gender?: string
  /** 주소 */
  address?: string
  /** 상세 주소 */
  detailAddress?: string
}

export interface MemberLoginRequest {
  /**
   * 이메일
   * @example "test@example.com"
   */
  email: string
  /**
   * 비밀번호
   * @example "qwer1234!"
   */
  password: string
}

export interface MemberResponse {
  /** 회원 ID */
  memberId: number
  /** 회원 이름 */
  name: string
  /** 닉네임 */
  nickname: string | null
  /** 이메일 */
  email: string
  /** 전화번호 */
  phoneNumber: string | null
}

export type MemberSignUpResponse = MemberResponse
export type MemberLoginResponse = MemberResponse

export const bodyToMember = (body: MemberSignUpRequest) => {
  return {
    name: body.name,
    nickname: body.nickname ?? null,
    email: body.email,
    phoneNumber: body.phoneNumber ?? null,
    birth: body.birth ? new Date(body.birth) : null,
    gender: body.gender ?? null,
    address: body.address ?? null,
    detailAddress: body.detailAddress ?? null,
  }
}

export const responseFromMember = (member: {
  id: number
  name: string
  nickname: string | null
  email: string
  phoneNumber: string | null
}): MemberResponse => {
  return {
    memberId: member.id,
    name: member.name,
    nickname: member.nickname,
    email: member.email,
    phoneNumber: member.phoneNumber,
  }
}
