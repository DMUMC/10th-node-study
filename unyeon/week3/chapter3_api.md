# 3주차 미션 - API 명세서

---

## 1. 회원 가입

### API Endpoint
`POST /api/v1/members`

### Request Header
| Key | Value | 설명 |
|-----|-------|------|
| Content-Type | application/json | 요청 데이터 형식 |

### Request Body
```json
{
  "name": "홍길동",
  "nickname": "길동이",
  "phoneNum": "010-1234-5678",
  "birth": "2000-01-01",
  "gender": "M",
  "address": "서울시 강남구",
  "specAddress": "역삼동 123-45",
  "preferFoodCategoryIds": [1, 3, 5],
  "termsAgreeIds": [1, 2, 3]
}
```

### Query String
없음

### Path Variable
없음

### Response (성공)
```json
{
  "success": true,
  "code": "S200",
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "memberId": 1,
    "name": "홍길동",
    "nickname": "길동이"
  }
}
```

### Error Case
| 코드 | 상태 | 메시지 |
|------|------|--------|
| E4001 | 400 | 이미 존재하는 전화번호입니다. |
| E4002 | 400 | 필수 약관에 동의하지 않았습니다. |
| E4003 | 400 | 필수 입력값이 누락되었습니다. |

---

## 2. 홈 화면 - 선택 지역의 도전 가능한 미션 목록 조회

### API Endpoint
`GET /api/v1/regions/{regionId}/missions`

### Request Header
| Key | Value | 설명 |
|-----|-------|------|
| Authorization | Bearer {accessToken} | 인증 토큰 |

### Request Body
없음

### Query String
| Key | Type | 필수 | 설명 |
|-----|------|------|------|
| page | int | N | 페이지 번호 (기본값: 0) |
| size | int | N | 페이지 크기 (기본값: 10) |

### Path Variable
| Key | Type | 설명 |
|-----|------|------|
| regionId | bigint | 조회할 지역 ID |

### Response (성공)
```json
{
  "success": true,
  "code": "S200",
  "message": "미션 목록 조회에 성공했습니다.",
  "data": {
    "missions": [
      {
        "missionId": 1,
        "storeName": "맛있는 식당",
        "storeAddress": "서울시 강남구 역삼동",
        "storeRating": 4.5,
        "missionTitle": "리뷰 작성하기",
        "missionSpec": "방문 후 리뷰 작성",
        "reward": 500,
        "deadLine": "2026-05-01"
      }
    ],
    "totalPages": 5,
    "currentPage": 0,
    "isLast": false
  }
}
```

---

## 3. 마이 페이지 조회

### API Endpoint
`GET /api/v1/members/me`

### Request Header
| Key | Value | 설명 |
|-----|-------|------|
| Authorization | Bearer {accessToken} | 인증 토큰 |

### Request Body
없음

### Query String
없음

### Path Variable
없음

### Response (성공)
```json
{
  "success": true,
  "code": "S200",
  "message": "마이페이지 조회에 성공했습니다.",
  "data": {
    "memberId": 1,
    "name": "홍길동",
    "nickname": "길동이",
    "profileImageUrl": "https://example.com/image.jpg",
    "phoneNum": "010-1234-5678",
    "point": 1500,
    "completedMissionCount": 10,
    "ongoingMissionCount": 3,
    "reviewCount": 7
  }
}
```

---

## 4. 리뷰 작성

### API Endpoint
`POST /api/v1/stores/{storeId}/reviews`

### Request Header
| Key | Value | 설명 |
|-----|-------|------|
| Authorization | Bearer {accessToken} | 인증 토큰 |
| Content-Type | application/json | 요청 데이터 형식 |

### Request Body
```json
{
  "content": "음식이 정말 맛있었습니다!",
  "score": 4.5
}
```

### Query String
없음

### Path Variable
| Key | Type | 설명 |
|-----|------|------|
| storeId | bigint | 리뷰를 작성할 가게 ID |

### Response (성공)
```json
{
  "success": true,
  "code": "S200",
  "message": "리뷰가 등록되었습니다.",
  "data": {
    "reviewId": 1,
    "storeId": 3,
    "content": "음식이 정말 맛있었습니다!",
    "score": 4.5,
    "createdAt": "2026-04-01T12:00:00"
  }
}
```

### Error Case
| 코드 | 상태 | 메시지 |
|------|------|--------|
| E4001 | 400 | 리뷰 내용을 입력해주세요. |
| E4002 | 400 | 별점은 0~5 사이의 값이어야 합니다. |
| E4004 | 404 | 존재하지 않는 가게입니다. |

---

## 5. 미션 목록 조회 (진행중 / 진행 완료)

### API Endpoint
`GET /api/v1/members/me/missions`

### Request Header
| Key | Value | 설명 |
|-----|-------|------|
| Authorization | Bearer {accessToken} | 인증 토큰 |

### Request Body
없음

### Query String
| Key | Type | 필수 | 설명 |
|-----|------|------|------|
| status | string | Y | `CHALLENGING` 또는 `COMPLETE` |
| page | int | N | 페이지 번호 (기본값: 0) |
| size | int | N | 페이지 크기 (기본값: 10) |

### Path Variable
없음

### Response (성공)
```json
{
  "success": true,
  "code": "S200",
  "message": "미션 목록 조회에 성공했습니다.",
  "data": {
    "missions": [
      {
        "missionId": 1,
        "storeName": "맛있는 식당",
        "missionTitle": "리뷰 작성하기",
        "missionSpec": "방문 후 리뷰 작성",
        "reward": 500,
        "deadLine": "2026-05-01",
        "status": "CHALLENGING",
        "createdAt": "2026-03-15T10:00:00"
      }
    ],
    "totalPages": 3,
    "currentPage": 0,
    "isLast": false
  }
}
```

### Error Case
| 코드 | 상태 | 메시지 |
|------|------|--------|
| E4001 | 400 | 유효하지 않은 미션 상태값입니다. |

---

## 6. 미션 도전하기 (미션 성공 누르기)

### API Endpoint
`PATCH /api/v1/members/me/missions/{missionId}`

### Request Header
| Key | Value | 설명 |
|-----|-------|------|
| Authorization | Bearer {accessToken} | 인증 토큰 |
| Content-Type | application/json | 요청 데이터 형식 |

### Request Body
```json
{
  "status": "COMPLETE"
}
```

### Query String
없음

### Path Variable
| Key | Type | 설명 |
|-----|------|------|
| missionId | bigint | 상태를 변경할 미션 ID |

### Response (성공)
```json
{
  "success": true,
  "code": "S200",
  "message": "미션이 완료 처리되었습니다.",
  "data": {
    "missionId": 1,
    "status": "COMPLETE",
    "reward": 500,
    "updatedAt": "2026-04-01T15:30:00"
  }
}
```

### Error Case
| 코드 | 상태 | 메시지 |
|------|------|--------|
| E4001 | 400 | 이미 완료된 미션입니다. |
| E4004 | 404 | 도전 중인 미션이 아닙니다. |
| E4005 | 400 | 미션 마감일이 지났습니다. |

---

## 7. 미션 도전 신청하기

### API Endpoint
`POST /api/v1/missions/{missionId}/challenges`

### Request Header
| Key | Value | 설명 |
|-----|-------|------|
| Authorization | Bearer {accessToken} | 인증 토큰 |

### Request Body
없음

### Query String
없음

### Path Variable
| Key | Type | 설명 |
|-----|------|------|
| missionId | bigint | 도전할 미션 ID |

### Response (성공)
```json
{
  "success": true,
  "code": "S200",
  "message": "미션 도전이 시작되었습니다.",
  "data": {
    "missionId": 1,
    "status": "CHALLENGING",
    "createdAt": "2026-04-01T12:00:00"
  }
}
```

### Error Case
| 코드 | 상태 | 메시지 |
|------|------|--------|
| E4001 | 400 | 이미 도전 중인 미션입니다. |
| E4002 | 400 | 미션 마감일이 지났습니다. |
| E4004 | 404 | 존재하지 않는 미션입니다. |
