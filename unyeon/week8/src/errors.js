// 도메인별 커스텀 에러 (시니어 미션: JSON 에러 응답 미들웨어에서 사용)
export class BaseError extends Error {
  constructor({ errorCode, reason, statusCode, data = null }) {
    super(reason)
    this.errorCode = errorCode
    this.reason = reason
    this.statusCode = statusCode
    this.data = data
  }
}

export class DuplicateEmailError extends BaseError {
  constructor(email) {
    super({
      errorCode: 'MEMBER4001',
      reason: '이미 존재하는 이메일입니다.',
      statusCode: 409,
      data: { email },
    })
  }
}

export class RegionNotFoundError extends BaseError {
  constructor(regionId) {
    super({
      errorCode: 'REGION4041',
      reason: '해당 지역을 찾을 수 없습니다.',
      statusCode: 404,
      data: { regionId },
    })
  }
}

export class StoreNotFoundError extends BaseError {
  constructor(storeId) {
    super({
      errorCode: 'STORE4041',
      reason: '해당 가게를 찾을 수 없습니다.',
      statusCode: 404,
      data: { storeId },
    })
  }
}

export class MissionNotFoundError extends BaseError {
  constructor(missionId) {
    super({
      errorCode: 'MISSION4041',
      reason: '해당 미션을 찾을 수 없습니다.',
      statusCode: 404,
      data: { missionId },
    })
  }
}

export class AlreadyChallengingError extends BaseError {
  constructor(memberId, missionId) {
    super({
      errorCode: 'MISSION4091',
      reason: '이미 도전 중인 미션입니다.',
      statusCode: 409,
      data: { memberId, missionId },
    })
  }
}

export class MemberNotFoundError extends BaseError {
  constructor(memberId) {
    super({
      errorCode: 'MEMBER4041',
      reason: '해당 회원을 찾을 수 없습니다.',
      statusCode: 404,
      data: { memberId },
    })
  }
}

export class BadRequestError extends BaseError {
  constructor(reason, data = null) {
    super({
      errorCode: 'COMMON4001',
      reason,
      statusCode: 400,
      data,
    })
  }
}
