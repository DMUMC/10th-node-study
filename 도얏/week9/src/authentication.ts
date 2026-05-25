import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from './db.config.js'

/**
 * TSOA 보안 미들웨어 - @Security("bearerAuth") 데코레이터와 연동
 * 이 함수의 반환값이 req.user 에 주입된다.
 */
export async function expressAuthentication(
  request: Request,
  securityName: string,
  _scopes?: string[],
): Promise<any> {
  if (securityName !== 'bearerAuth') {
    throw Object.assign(new Error('지원하지 않는 인증 방식입니다.'), { status: 401 })
  }

  const authHeader = request.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    throw Object.assign(new Error('인증 토큰이 필요합니다.'), { status: 401 })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number }
    const user = await prisma.user.findFirst({ where: { id: decoded.id } })
    if (!user) {
      throw Object.assign(new Error('사용자를 찾을 수 없습니다.'), { status: 401 })
    }
    return user
  } catch (err: any) {
    if (err.status) throw err
    throw Object.assign(new Error('유효하지 않은 토큰입니다.'), { status: 401 })
  }
}
