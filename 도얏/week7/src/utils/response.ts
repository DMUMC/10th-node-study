export const BaseResponse = <T>(result: T, message = '성공입니다.', code = 'COMMON200') => {
  return {
    isSuccess: true,
    code,
    message,
    result,
  }
}
