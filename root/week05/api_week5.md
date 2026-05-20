## 1-1. 특정 지역에 가게 추가하기 API

`POST /api/regions/{regionId}/stores`  
`Content-Type: application/json`

**Request Body**
```json
{
  "name": "식당",
  "address": "서울시 강남구 ",
  "category": "한식",
  "description": "설명",
  "image_url": "https://..."
}
```

**Response**
```json
{
  "store_id": 1,
  "name": "식당",
  "region_id": 3,
  "created_at": "2026-04-15T10:00:00"
}
```

---

## 1-2. 가게에 리뷰 추가하기 API


`POST /api/stores/{storeId}/reviews`  
`Authorization: Bearer {token}`  
`Content-Type: application/json`

**Request Body**
```json
{
  "user_mission_id": 101,
  "rating": 5,
  "content": "맛있어요",
  "image_url": "https://..."
}
```

**Response**
```json
{
  "review_id": 42,
  "store_id": 5,
  "rating": 5,
  "created_at": "2026-04-15T10:00:00"
}
```

---

## 1-3. 가게에 미션 추가하기 API

`POST /api/stores/{storeId}/missions`  
`Content-Type: application/json`

**Request Body**
```json
{
  "region_id": 3,
  "title": "미션 제목",
  "description": "미션 설명"
}
```

**Response**
```json
{
  "mission_id": 10,
  "store_id": 5,
  "name": "미션 제목",
  "reward_points": 500
}
```

---

## 1-4. 가게의 미션을 도전 중인 미션에 추가(미션 도전하기) API

`POST /api/missions/{missionId}/challenge`  
`Authorization: Bearer {token}`

**Response**
```json
{
  "user_mission_id": 55,
  "mission_id": 10,
  "user_id": 1,
  "status": "IN_PROGRESS",
  "started_at": "2026-04-15T10:00:00"
}
```

---

## 2. Controller → Service → Repository → DB 요청 흐름

1. 사용자가 `POST /api/v1/users/signup` 요청을 보냄
2. request body를 받아서 service 함수 호출
3. 값이 유효한지 db 조회
4. 테이블에 삽입
5. 저장된 정보를 반환

---

## 3. 회원가입 API 비밀번호 해싱 과정

1. 사용자가 password 평문을 Request Body로 전송
2. Service 레이어에서 bcrypt로 해싱
3. 해시된 값을 DB에 저장