import { memberService } from '../services/member.service.js'

export const memberController = {
  signUp: (req, res) => {
    const result = memberService.signUp(req.body)
    res.status(201).json({ success: true, code: 'S201', message: '회원가입이 완료되었습니다.', data: result })
  },

  getMyPage: (req, res) => {
    const result = memberService.getMyPage(1) // TODO: 토큰에서 memberId 추출
    res.status(200).json({ success: true, code: 'S200', message: '마이페이지 조회에 성공했습니다.', data: result })
  },

  getMyMissions: (req, res) => {
    const { status, page, size } = req.query
    const result = memberService.getMyMissions(1, status, page, size)
    res.status(200).json({ success: true, code: 'S200', message: '미션 목록 조회에 성공했습니다.', data: result })
  }
}
