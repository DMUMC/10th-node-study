export class AppError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const errors = {
  USER_NOT_FOUND:       new AppError("존재하지 않는 유저입니다.", "4040", 404),
  STORE_NOT_FOUND:      new AppError("존재하지 않는 가게입니다.", "4041", 404),
  MISSION_NOT_FOUND:    new AppError("존재하지 않는 미션입니다.", "4042", 404),
  ALREADY_COMPLETED:    new AppError("이미 완료된 미션입니다.", "4090", 409),
  EMAIL_ALREADY_EXISTS: new AppError("이미 존재하는 이메일입니다.", "4091", 409),
  INVALID_PASSWORD:     new AppError("비밀번호가 일치하지 않습니다.", "4010", 401),
  UNAUTHORIZED:         new AppError("로그인이 필요합니다.", "4011", 401),
  INVALID_TOKEN:        new AppError("유효하지 않은 토큰입니다.", "4012", 401),
};