export class BaseError extends Error {
  status: number
  code: string

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message)
    this.name = 'BaseError'
    this.status = statusCode
    this.code = code
  }
}
