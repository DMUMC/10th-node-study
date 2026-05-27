// TSOA Swagger 문서화에 사용할 표준 응답 타입
export interface ApiResponse<T> {
  isSuccess: boolean
  code: string
  message: string
  result: T | null
}

// 성공 응답 생성 헬퍼
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
