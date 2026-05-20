import { StatusCodes } from 'http-status-codes'
import { BaseError } from '../errors.js'

// 시니어 미션: HTML 오류 페이지 대신 JSON으로 응답
export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  console.error('[ERROR]', err)

  // 도메인 커스텀 에러
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      resultType: 'FAIL',
      error: {
        errorCode: err.errorCode,
        reason: err.reason,
        data: err.data,
      },
      success: null,
    })
  }

  // 예상치 못한 에러
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    resultType: 'FAIL',
    error: {
      errorCode: 'COMMON5001',
      reason: err.message || '서버 내부 오류가 발생했습니다.',
      data: null,
    },
    success: null,
  })
}

// 404 Not Found (라우트 매칭 실패)
export const notFoundHandler = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    resultType: 'FAIL',
    error: {
      errorCode: 'COMMON4041',
      reason: `요청하신 경로를 찾을 수 없습니다. (${req.method} ${req.originalUrl})`,
      data: null,
    },
    success: null,
  })
}
