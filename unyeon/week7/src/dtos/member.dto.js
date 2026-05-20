// 회원가입 요청 body → User 객체 변환
export const bodyToSignUp = (body) => {
  return {
    email: body.email,
    password: body.password,
    name: body.name,
    nickname: body.nickname,
    gender: body.gender ?? null,
    birth: body.birth ? new Date(body.birth) : null,
    phoneNum: body.phoneNum ?? null,
    address: body.address ?? '',
    specAddress: body.specAddress ?? '',
  }
}

// 회원가입 응답 DTO (비밀번호는 절대 내려주지 않음)
export const responseFromMember = (member) => {
  return {
    id: member.id,
    email: member.email,
    name: member.name,
    nickname: member.nickname,
    point: member.point,
    status: member.status,
    createdAt: member.created_at,
  }
}
