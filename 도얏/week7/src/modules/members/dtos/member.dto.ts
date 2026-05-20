// 회원가입 요청 인터페이스
export interface MemberSignUpRequest {
  name: string
  nickname: string
  email?: string
  password?: string
  phoneNum?: string
  birth?: string   // "YYYY-MM-DD"
  gender?: string  // "MALE" | "FEMALE" | "OTHER"
  address?: string
  specAddress?: string
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
