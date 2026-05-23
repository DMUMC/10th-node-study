import { Request, Response, NextFunction } from 'express'
import { BaseError } from '../utils/errors.js'

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof BaseError) {
    res.status(err.status).json({
      isSuccess: false,
      code: err.code,
      message: err.message,
      result: null,
    })
    return
  }

  // Prisma unique constraint 에러
  if (typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002') {
    res.status(409).json({
      isSuccess: false,
      code: 'USER4002',
      message: '이미 존재하는 데이터입니다.',
      result: null,
    })
    return
  }

  console.error(err)
  res.status(500).json({
    isSuccess: false,
    code: 'COMMON500',
    message: '서버 내부 오류입니다.',
    result: null,
  })
}
