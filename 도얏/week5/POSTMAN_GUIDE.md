# Postman API 테스트 가이드 — Week 5 UMC Mission Service

## 목차
1. [Workspace & Collection 생성](#1-workspace--collection-생성)
2. [환경 변수 설정](#2-환경-변수-설정)
3. [API 요청 목록](#3-api-요청-목록)
   - [서버 상태 확인](#31-서버-상태-확인)
   - [회원가입](#32-회원가입)
   - [가게 등록](#33-가게-등록)
   - [리뷰 작성](#34-리뷰-작성)
   - [미션 생성](#35-미션-생성)
   - [미션 도전](#36-미션-도전)
4. [에러 케이스 테스트](#4-에러-케이스-테스트)
5. [응답 형식 정리](#5-응답-형식-정리)

---

## 1. Workspace & Collection 생성

1. Postman 왼쪽 상단 **[Workspaces]** → 내 작업 공간으로 이동
2. 왼쪽 메뉴 **[Collections]** 옆 `+` 버튼 클릭
3. 이름을 `UMC-Week5-Mission-Service`로 변경
4. 하위에 폴더를 만들어 도메인별로 요청을 분류하면 편리합니다:
   - `Members` — 회원 관련
   - `Stores` — 가게 관련
   - `Reviews` — 리뷰 관련
   - `Missions` — 미션 관련

---

## 2. 환경 변수 설정

서버 주소를 매번 입력하지 않도록 환경 변수를 등록합니다.

1. 왼쪽 메뉴 **[Environments]** → `+` 버튼 클릭
2. 환경 이름: `Local`
3. 아래 변수 등록 후 **Save**

| Variable | Initial Value | 설명 |
|---|---|---|
| `host` | `http://localhost:3000` | 서버 주소 (`.env`의 `PORT=3000` 기준) |

4. 우측 상단 드롭다운에서 **Local** 선택

> 요청 URL에서 `{{host}}`로 참조합니다. 예: `{{host}}/api/v1/members/signup`

---

## 3. API 요청 목록

### 3.1 서버 상태 확인

| 항목 | 내용 |
|---|---|
| **Method** | `GET` |
| **URL** | `{{host}}/` |
| **Body** | 없음 |
| **기대 응답** | `200 OK` |

**응답 예시**
```json
"Hello World!"
```

---

### 3.2 회원가입

| 항목 | 내용 |
|---|---|
| **Method** | `POST` |
| **URL** | `{{host}}/api/v1/members/signup` |
| **Headers** | `Content-Type: application/json` |
| **기대 응답** | `201 Created` |

**Request Body (raw → JSON)**
```json
{
  "name": "언년",
  "nickname": "unyeon",
  "email": "unyeon@umc.com",
  "password": "password123!",
  "phoneNum": "010-1234-5678",
  "birth": "2000-01-01",
  "gender": "FEMALE",
  "address": "서울특별시 강남구",
  "specAddress": "101동 202호"
}
```

> `name`, `nickname`은 필수값입니다. 나머지는 선택 사항입니다.  
> `gender` 허용값: `"MALE"` | `"FEMALE"` | `"OTHER"`  
> `birth`, `deadLine` 날짜 형식: `"YYYY-MM-DD"`

**성공 응답 예시**
```json
{
  "success": true,
  "data": {
    "memberId": 1,
    "name": "언년",
    "nickname": "unyeon",
    "email": "unyeon@umc.com",
    "phoneNum": "010-1234-5678",
    "status": "ACTIVE"
  }
}
```

---

### 3.3 가게 등록

| 항목 | 내용 |
|---|---|
| **Method** | `POST` |
| **URL** | `{{host}}/api/v1/stores` |
| **Headers** | `Content-Type: application/json` |
| **기대 응답** | `201 Created` |

**Request Body (raw → JSON)**
```json
{
  "regionId": 1,
  "foodCategoryId": 1,
  "name": "맛있는 치킨집",
  "description": "바삭하고 맛있는 치킨을 판매합니다.",
  "address": "서울특별시 마포구 홍대입구역 1번 출구",
  "lat": 37.5563,
  "lng": 126.9239
}
```

> `regionId`, `foodCategoryId`, `name`, `address`는 필수값입니다.  
> `regionId`와 `foodCategoryId`는 DB에 미리 존재하는 값을 사용해야 합니다.

**성공 응답 예시**
```json
{
  "success": true,
  "data": {
    "storeId": 1,
    "name": "맛있는 치킨집",
    "address": "서울특별시 마포구 홍대입구역 1번 출구",
    "regionId": 1
  }
}
```

---

### 3.4 리뷰 작성

| 항목 | 내용 |
|---|---|
| **Method** | `POST` |
| **URL** | `{{host}}/api/v1/stores/:storeId/reviews` |
| **URL 예시** | `{{host}}/api/v1/stores/1/reviews` |
| **Headers** | `Content-Type: application/json` |
| **기대 응답** | `201 Created` |

**Request Body (raw → JSON)**
```json
{
  "memberId": 1,
  "content": "치킨이 정말 바삭하고 맛있었어요! 또 방문할 것 같아요.",
  "score": 5
}
```

> `memberId`, `content`, `score`는 모두 필수값입니다.  
> `score` 허용 범위: `1` ~ `5` (정수)

**성공 응답 예시**
```json
{
  "success": true,
  "data": {
    "reviewId": 1,
    "memberId": 1,
    "storeId": 1,
    "content": "치킨이 정말 바삭하고 맛있었어요! 또 방문할 것 같아요.",
    "score": 5,
    "createdAt": "2026-04-18T12:00:00.000Z"
  }
}
```

---

### 3.5 미션 생성

| 항목 | 내용 |
|---|---|
| **Method** | `POST` |
| **URL** | `{{host}}/api/v1/stores/:storeId/missions` |
| **URL 예시** | `{{host}}/api/v1/stores/1/missions` |
| **Headers** | `Content-Type: application/json` |
| **기대 응답** | `201 Created` |

**Request Body (raw → JSON)**
```json
{
  "title": "치킨 3번 주문하기",
  "reward": 500,
  "spec": "한 달 내에 치킨을 3번 주문하면 500포인트 적립!",
  "deadLine": "2026-05-31"
}
```

> `title`, `reward`는 필수값입니다.  
> `reward`는 지급할 포인트 수량입니다.

**성공 응답 예시**
```json
{
  "success": true,
  "data": {
    "missionId": 1,
    "storeId": 1,
    "title": "치킨 3번 주문하기",
    "reward": 500,
    "spec": "한 달 내에 치킨을 3번 주문하면 500포인트 적립!",
    "deadLine": "2026-05-31T00:00:00.000Z"
  }
}
```

---

### 3.6 미션 도전

| 항목 | 내용 |
|---|---|
| **Method** | `POST` |
| **URL** | `{{host}}/api/v1/missions/:missionId/challenge` |
| **URL 예시** | `{{host}}/api/v1/missions/1/challenge` |
| **Headers** | `Content-Type: application/json` |
| **기대 응답** | `201 Created` |

**Request Body (raw → JSON)**
```json
{
  "memberId": 1
}
```

**성공 응답 예시**
```json
{
  "success": true,
  "data": {
    "memberMissionId": 1,
    "memberId": 1,
    "missionId": 1,
    "status": "CHALLENGING"
  }
}
```

---

## 4. 에러 케이스 테스트

각 요청을 **복제(Duplicate)** 해서 에러 케이스 전용 요청으로 저장해 두면 좋습니다.

### 회원가입 에러

| 케이스 | 방법 | 기대 응답 |
|---|---|---|
| 이메일 중복 | 동일한 `email`로 두 번 요청 | `409 Conflict` |
| 필수값 누락 | `name` 또는 `nickname` 제거 | `400 Bad Request` 또는 DB 에러 |

### 리뷰 작성 에러

| 케이스 | 방법 | 기대 응답 |
|---|---|---|
| 존재하지 않는 가게 | URL의 `storeId`를 `99999`로 변경 | `404 Not Found` |
| 점수 범위 초과 | `"score": 6` 또는 `"score": 0` | `400 Bad Request` |

### 미션 도전 에러

| 케이스 | 방법 | 기대 응답 |
|---|---|---|
| 존재하지 않는 미션 | URL의 `missionId`를 `99999`로 변경 | `404 Not Found` |
| 중복 도전 | 동일한 `memberId`로 같은 미션에 두 번 요청 | `409 Conflict` |

### 미션/리뷰 공통 에러

| 케이스 | 방법 | 기대 응답 |
|---|---|---|
| 존재하지 않는 가게에 미션 생성 | URL의 `storeId`를 `99999`로 변경 | `404 Not Found` |

---

## 5. 응답 형식 정리

모든 API는 아래 두 가지 형식 중 하나로 응답합니다.

**성공 시**
```json
{
  "success": true,
  "data": { ... }
}
```

**실패 시**
```json
{
  "success": false,
  "code": "E404",
  "message": "에러 메시지"
}
```

| 상태 코드 | 코드 형식 | 상황 |
|---|---|---|
| `201 Created` | — | 리소스 생성 성공 |
| `400 Bad Request` | `E400` | 잘못된 입력값 (예: score 범위 초과) |
| `404 Not Found` | `E404` | 존재하지 않는 리소스 |
| `409 Conflict` | `E409` | 중복 데이터 (이메일, 미션 중복 도전) |
| `500 Internal Server Error` | `E500` | 서버/DB 오류 |

---

> **응답 저장 팁:** 성공 응답이 왔을 때 응답창 우측 **[Save Response]** → **[Save as example]** 을 클릭하면 Postman Documentation 탭에 예시 응답이 자동으로 기록됩니다. 에러 케이스도 함께 저장해두면 팀원과 공유하기 편리합니다.
