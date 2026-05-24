export interface SuccessResponse<T = unknown> {
  isSuccess: true;
  code: string;
  message: string;
  result: T;
}

export interface ErrorResponse {
  isSuccess: false;
  code: string;
  message: string;
}