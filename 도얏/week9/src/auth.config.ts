import dotenv from 'dotenv'
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import jwt from 'jsonwebtoken'
import { prisma } from './db.config.js'

dotenv.config()

// ────────────────────────────────────────────────
// JWT 토큰 생성 헬퍼
// ────────────────────────────────────────────────

/** Access Token 발급 (수명 1시간) */
export const generateAccessToken = (user: { id: number; email: string }) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' })

/** Refresh Token 발급 (수명 14일, 최소 정보만 담음) */
export const generateRefreshToken = (user: { id: number }) =>
  jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '14d' })

// ────────────────────────────────────────────────
// Google 로그인 전략
// ────────────────────────────────────────────────

/**
 * Google 프로필로 사용자를 조회하거나 신규 생성한다.
 * Google 로그인 시에는 email, name만 필수이며
 * 나머지 필드는 나중에 PATCH /members/me 로 채울 수 있다.
 */
const googleVerify = async (profile: Profile) => {
  const email = profile.emails?.[0]?.value
  if (!email) throw new Error('Google 프로필에 이메일이 없습니다.')

  let user = await prisma.user.findFirst({ where: { email } })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: profile.displayName ?? '이름 미설정',
      },
    })
  }

  return { id: user.id, email: user.email, name: user.name }
}

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID!,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET!,
    callbackURL: '/oauth2/callback/google',
    scope: ['email', 'profile'],
  },
  async (_accessToken, _refreshToken, profile, cb) => {
    try {
      const user = await googleVerify(profile)
      const tokens = {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
      }
      return cb(null, tokens)
    } catch (err) {
      return cb(err as Error)
    }
  },
)

// ────────────────────────────────────────────────
// JWT 검증 전략 (보호된 라우트에서 Bearer 토큰 검증)
// ────────────────────────────────────────────────

export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
  },
  async (payload: { id: number }, done) => {
    try {
      const user = await prisma.user.findFirst({ where: { id: payload.id } })
      return user ? done(null, user) : done(null, false)
    } catch (err) {
      return done(err, false)
    }
  },
)
