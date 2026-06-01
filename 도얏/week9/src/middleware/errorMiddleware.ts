import { Request, Response, NextFunction } from 'express'
import { BaseError } from '../utils/errors.js'
import { ErrorCode } from '../utils/errorCode.js'

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const sendErrorResponse = (error: (typeof ErrorCode)[keyof typeof ErrorCode]) => {
    res.status(error.status).json({
      isSuccess: false,
      code: error.code,
      message: error.message,
      result: null,
    })
  }

  if (err instanceof BaseError) {
    res.status(err.status).json({
      isSuccess: false,
      code: err.code,
      message: err.message,
      result: null,
    })
    return
  }

  const prismaCode = typeof err === 'object' && err !== null ? (err as { code?: string }).code : undefined

  if (prismaCode === 'P2002') {
    const target = (err as { meta?: { target?: string[] | string } }).meta?.target
    const fields = Array.isArray(target) ? target : [target]
    const error = fields.includes('email') ? ErrorCode.DUPLICATE_EMAIL : ErrorCode.INVALID_INPUT
    sendErrorResponse(error)
    return
  }

  if (prismaCode === 'P2025') {
    sendErrorResponse(ErrorCode.USER_NOT_FOUND)
    return
  }

  console.error(err)
  sendErrorResponse(ErrorCode.INTERNAL_ERROR)
}
