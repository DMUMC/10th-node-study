export const ErrorCode = {
  // 공통
  INTERNAL_ERROR: { status: 500, code: 'COMMON500', message: '서버 내부 오류입니다.' },
  INVALID_INPUT: { status: 400, code: 'COMMON400', message: '잘못된 입력값입니다.' },

  // 인증/인가
  UNAUTHORIZED: { status: 401, code: 'AUTH4001', message: '인증 토큰이 필요합니다.' },
  INVALID_TOKEN: { status: 401, code: 'AUTH4002', message: '유효하지 않은 토큰입니다.' },
  FORBIDDEN: { status: 403, code: 'AUTH4003', message: '접근 권한이 없습니다.' },

  // 회원
  USER_NOT_FOUND: { status: 404, code: 'USER4001', message: '사용자를 찾을 수 없습니다.' },
  DUPLICATE_EMAIL: { status: 409, code: 'USER4002', message: '이미 사용 중인 이메일입니다.' },
  MEMBER_REQUIRED_FIELD: { status: 400, code: 'USER4003', message: 'name과 nickname은 필수 입력값입니다.' },

  // 가게
  STORE_NOT_FOUND: { status: 404, code: 'STORE4001', message: '존재하지 않는 가게입니다.' },
  STORE_CREATE_FAILED: { status: 500, code: 'STORE5001', message: '가게 생성 후 조회에 실패했습니다.' },

  // 리뷰
  INVALID_SCORE: { status: 400, code: 'REVIEW4001', message: '별점은 1~5 사이여야 합니다.' },
  REVIEW_CREATE_FAILED: { status: 500, code: 'REVIEW5001', message: '리뷰 생성 후 조회에 실패했습니다.' },

  // 미션
  MISSION_NOT_FOUND: { status: 404, code: 'MISSION4001', message: '존재하지 않는 미션입니다.' },
  MISSION_ALREADY_CHALLENGING: { status: 409, code: 'MISSION4002', message: '이미 도전 중인 미션입니다.' },
  ONGOING_MISSION_NOT_FOUND: { status: 404, code: 'MISSION4003', message: '진행 중인 미션이 없습니다.' },
  MISSION_STATUS_REQUIRED: { status: 400, code: 'MISSION4004', message: 'status는 필수 입력값입니다. (CHALLENGING 또는 COMPLETE)' },
  MISSION_CREATE_FAILED: { status: 500, code: 'MISSION5001', message: '미션 생성 후 조회에 실패했습니다.' },
  MISSION_CHALLENGE_FAILED: { status: 500, code: 'MISSION5002', message: '미션 도전 후 조회에 실패했습니다.' },
} as const
