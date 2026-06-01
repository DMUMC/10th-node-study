// 회원가입 요청 인터페이스
export interface MemberSignUpRequest {
  /** 회원 이름 */
  name: string
  /** 닉네임 */
  nickname?: string
  /**
   * 이메일
   * @example "test@example.com"
   */
  email?: string
  /**
   * 비밀번호
   * @example "qwer1234!"
   */
  password?: string
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

// 회원가입 응답 인터페이스
export interface MemberSignUpResponse {
  /** 생성된 회원 ID */
  memberId: number
  /** 회원 이름 */
  name: string
  /** 닉네임 */
  nickname: string | null
  /** 이메일 */
  email: string | null
  /** 전화번호 */
  phoneNumber: string | null
}

// 사용자 정보 수정 요청 인터페이스 (미션 2)
export interface UserUpdateRequest {
  /** 닉네임 */
  nickname?: string
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

// 사용자 정보 수정 응답 인터페이스
export interface UserUpdateResponse {
  memberId: number
  name: string
  nickname: string | null
  email: string | null
  phoneNumber: string | null
  gender: string | null
  birth: Date | null
  address: string | null
  detailAddress: string | null
}

// req.body → 내부 데이터로 변환 (회원가입)
export const bodyToMember = (body: MemberSignUpRequest) => {
  return {
    name: body.name,
    nickname: body.nickname ?? null,
    email: body.email ?? null,
    phoneNumber: body.phoneNumber ?? null,
    birth: body.birth ? new Date(body.birth) : null,
    gender: body.gender ?? null,
    address: body.address ?? null,
    detailAddress: body.detailAddress ?? null,
  }
}

// req.body → 내부 데이터로 변환 (사용자 정보 수정)
export const bodyToUserUpdate = (body: UserUpdateRequest) => {
  const data: Record<string, any> = {}
  if (body.nickname !== undefined)     data.nickname     = body.nickname
  if (body.phoneNumber !== undefined)  data.phoneNumber  = body.phoneNumber
  if (body.birth !== undefined)        data.birth        = new Date(body.birth)
  if (body.gender !== undefined)       data.gender       = body.gender
  if (body.address !== undefined)      data.address      = body.address
  if (body.detailAddress !== undefined) data.detailAddress = body.detailAddress
  return data
}

// DB 결과 → 응답 형태로 변환 (회원가입)
export const responseFromMember = (member: {
  id: number
  name: string
  nickname: string | null
  email: string | null
  phoneNumber: string | null
}) => {
  return {
    memberId: member.id,
    name: member.name,
    nickname: member.nickname,
    email: member.email,
    phoneNumber: member.phoneNumber,
  }
}

// DB 결과 → 응답 형태로 변환 (사용자 정보 수정)
export const responseFromUserUpdate = (member: {
  id: number
  name: string
  nickname: string | null
  email: string | null
  phoneNumber: string | null
  gender: string | null
  birth: Date | null
  address: string | null
  detailAddress: string | null
}): UserUpdateResponse => {
  return {
    memberId: member.id,
    name: member.name,
    nickname: member.nickname,
    email: member.email,
    phoneNumber: member.phoneNumber,
    gender: member.gender,
    birth: member.birth,
    address: member.address,
    detailAddress: member.detailAddress,
  }
}
