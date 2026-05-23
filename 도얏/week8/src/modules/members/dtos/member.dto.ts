// 회원가입 요청 인터페이스
export interface MemberSignUpRequest {
  /** 회원 이름 */
  name: string
  /** 닉네임 */
  nickname: string
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
  phoneNum?: string
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
  specAddress?: string
}

// 회원가입 응답 인터페이스
export interface MemberSignUpResponse {
  /** 생성된 회원 ID */
  memberId: number
  /** 회원 이름 */
  name: string
  /** 닉네임 */
  nickname: string
  /** 이메일 */
  email: string | null
  /** 전화번호 */
  phoneNum: string | null
  /** 회원 상태 */
  status: string
}

// req.body → 내부 데이터로 변환
export const bodyToMember = (body: MemberSignUpRequest) => {
  return {
    name: body.name,
    nickname: body.nickname,
    email: body.email ?? null,
    phoneNum: body.phoneNum ?? null,
    birth: body.birth ? new Date(body.birth) : null,
    gender: body.gender ?? null,
    address: body.address ?? null,
    specAddress: body.specAddress ?? null,
  }
}

// DB 결과 → 응답 형태로 변환
export const responseFromMember = (member: {
  id: number
  name: string
  nickname: string
  email: string | null
  phone_num: string | null
  status: string
}) => {
  return {
    memberId: member.id,
    name: member.name,
    nickname: member.nickname,
    email: member.email,
    phoneNum: member.phone_num,
    status: member.status,
  }
}
