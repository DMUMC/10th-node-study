// 공통 성공/실패 응답 메서드를 res 객체에 주입
export const responseHandler = (req, res, next) => {
  res.success = (success) => {
    return res.json({
      resultType: 'SUCCESS',
      error: null,
      success,
    })
  }

  res.error = ({ errorCode = 'unknown', reason = null, data = null }) => {
    return res.json({
      resultType: 'FAIL',
      error: { errorCode, reason, data },
      success: null,
    })
  }

  next()
}
