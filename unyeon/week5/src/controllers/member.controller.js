import { StatusCodes } from 'http-status-codes'
import { bodyToSignUp } from '../dtos/member.dto.js'
import { memberSignUp } from '../services/member.service.js'

// 회원가입 (비밀번호 해싱 포함)
export const handleMemberSignUp = async (req, res, next) => {
  try {
    console.log('회원가입을 요청했습니다!')
    console.log('body:', req.body)

    const result = await memberSignUp(bodyToSignUp(req.body))
    res.status(StatusCodes.CREATED).success(result)
  } catch (err) {
    next(err)
  }
}
