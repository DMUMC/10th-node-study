import { ErrorCode, ErrorCodeValue } from './errorCode.js'

export class BaseError extends Error {
  status: number
  code: string

  constructor(errorCode: ErrorCodeValue = ErrorCode.INTERNAL_ERROR) {
    super(errorCode.message)
    this.name = 'BaseError'
    this.status = errorCode.status
    this.code = errorCode.code
  }
}
