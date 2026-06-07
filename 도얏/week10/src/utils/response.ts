export interface ApiResponse<T> {
  isSuccess: boolean
  code: string
  message: string
  result: T | null
}

export const successResponse = <T>(result: T): ApiResponse<T> => ({
  isSuccess: true,
  code: 'COMMON200',
  message: '성공입니다.',
  result,
})

/**
 * @deprecated successResponse를 사용하세요.
 */
export const BaseResponse = <T>(result: T, message = '성공입니다.', code = 'COMMON200') => {
  return {
    isSuccess: true,
    code,
    message,
    result,
  }
}
