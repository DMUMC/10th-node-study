import jwt from 'jsonwebtoken'
import { BaseError } from '../errors.js'

export class UnauthorizedError extends BaseError {
  constructor() {
    super({
      errorCode: 'AUTH4011',
      reason: '로그인이 필요합니다.',
      statusCode: 401,
      data: null,
    })
  }
}

export class InvalidTokenError extends BaseError {
  constructor() {
    super({
      errorCode: 'AUTH4012',
      reason: '유효하지 않은 토큰입니다.',
      statusCode: 401,
      data: null,
    })
  }
}

// 로그인 인증 미들웨어
export const isLogin = (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError())
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded  // { id, email }
    next()
  } catch (err) {
    next(new InvalidTokenError())
  }
}
