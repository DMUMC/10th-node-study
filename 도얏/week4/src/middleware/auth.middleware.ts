import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'umc-week4-secret'

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, code: 'E401', message: '인증 토큰이 필요합니다.' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { memberId: number }
    req.memberId = decoded.memberId
    next()
  } catch {
    res.status(401).json({ success: false, code: 'E401', message: '유효하지 않은 토큰입니다.' })
  }
}
