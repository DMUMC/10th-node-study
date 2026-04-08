import { Request, Response, NextFunction } from 'express'
import { memberService } from '../services/member.service.js'

export const memberController = {
  signUp: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await memberService.signUp(req.body)
      res.status(201).json({ success: true, code: 'S201', message: '회원가입이 완료되었습니다.', data: result })
    } catch (e) {
      next(e)
    }
  },

  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await memberService.login(req.body)
      res.status(200).json({ success: true, code: 'S200', message: '로그인에 성공했습니다.', data: result })
    } catch (e) {
      next(e)
    }
  },

  getMyPage: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = memberService.getMyPage(req.memberId!)
      res.status(200).json({ success: true, code: 'S200', message: '마이페이지 조회에 성공했습니다.', data: result })
    } catch (e) {
      next(e)
    }
  },

  getMyMissions: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { status, page, size } = req.query as Record<string, string | undefined>
      const result = memberService.getMyMissions(req.memberId!, status, page, size)
      res.status(200).json({ success: true, code: 'S200', message: '미션 목록 조회에 성공했습니다.', data: result })
    } catch (e) {
      next(e)
    }
  },
}
