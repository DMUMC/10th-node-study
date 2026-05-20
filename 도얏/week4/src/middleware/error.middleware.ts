import { Request, Response, NextFunction } from 'express'

interface AppError extends Error {
  status?: number
}

export const errorMiddleware = (err: AppError, req: Request, res: Response, _next: NextFunction): void => {
  console.error(`[Error] ${err.message}`)

  const status = err.status ?? 500
  res.status(status).json({
    success: false,
    code: `E${status}`,
    message: err.message || '서버 오류가 발생했습니다.',
  })
}
