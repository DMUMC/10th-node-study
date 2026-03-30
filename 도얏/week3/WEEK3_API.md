
---

# 미션 서비스 API 명세서

## 1. 회원 관련 API

### **[POST] 회원가입**
* **Endpoint**: `/users/signup`
* **Request Header**: `Content-Type: application/json`
* **Request Body**:
    ```json
    {
      "email": "string",
      "password": "string",
      "name": "string",
      "gender": "integer",
      "birth": "string",
      "address": "string"
    }
    ```
* **설명**: 새로운 사용자 계정을 생성합니다.

### **[POST] 선호 조사 내역 저장**
* **Endpoint**: `/users/preferences`
* **Request Header**: `Authorization: Bearer {token}`, `Content-Type: application/json`
* **Request Body**:
    ```json
    {
      "category_ids": [1, 2, 3]
    }
    ```
* **설명**: 회원가입 후 사용자의 관심 카테고리 정보를 저장합니다.

---

## 2. 홈 및 미션 관리 API

### **[GET] 홈 화면: 내가 받은 미션 조회**
* **Endpoint**: `/members/me/missions/active`
* **Request Header**: `Authorization: Bearer {token}`
* **Query String**: `page=0&size=10`
* **설명**: 홈 화면에서 현재 사용자가 할당받거나 진행 중인 미션 목록을 조회합니다.

### **[GET] 미션 목록 조회 (수행 중 / 완료)**
* **Endpoint**: `/members/me/missions`
* **Request Header**: `Authorization: Bearer {token}`
* **Query String**:
    * `status`: `CHALLENGING` (수행 중) 또는 `COMPLETE` (완료)
    * `page`: 페이지 번호
* **설명**: 사용자의 미션 수행 기록을 상태별로 필터링하여 조회합니다.

### **[POST] 미션 도전하기 (성공 누르기)**
* **Endpoint**: `/members/me/missions/{missionId}`
* **Path Variable**: `missionId` (도전할 미션의 ID)
* **Request Header**: `Authorization: Bearer {token}`
* **설명**: 특정 미션을 수행하기 시작하거나 완료를 요청합니다.

---

## 3. 지도 및 가게 관련 API

### **[GET] 지역별 가게 리스트 조회**
* **Endpoint**: `/regions/{regionId}/stores`
* **Path Variable**: `regionId` (지역 ID)
* **Query String**: `last_store_id=10&size=10`
* **설명**: 특정 지역에 등록된 가게들의 목록을 조회합니다.

### **[GET] 가게 정보 및 미션 조회**
* **Endpoint**: `/stores/{storeId}`
* **Path Variable**: `storeId` (가게 ID)
* **설명**: 특정 가게의 상세 정보와 해당 가게에서 진행 가능한 미션 목록을 조회합니다.

---

## 4. 마이페이지 및 리뷰 API

### **[POST] 리뷰 작성하기**
* **Endpoint**: `/members/me/missions/{memberMissionId}/reviews`
* **Path Variable**: `memberMissionId` (완료된 미션 수행 기록 ID)
* **Request Header**: `Authorization: Bearer {token}`
* **Request Body**:
    ```json
    {
      "content": "string",
      "score": "float",
      "image_url": "string"
    }
    ```
* **설명**: 완료된 미션에 대해 가게 리뷰와 별점을 작성합니다.

### **[GET] 내 포인트 조회**
* **Endpoint**: `/members/me/points`
* **Request Header**: `Authorization: Bearer {token}`
* **설명**: 사용자가 현재 보유한 총 포인트와 적립 내역을 확인합니다.

---

## 핵심 비즈니스 로직

### **지역 보너스 포인트 자동 지급**
* **적용 대상 API**: `POST /members/me/missions/{missionId}` (미션 완료 처리 시)
* **로직 상세**:
    1.  사용자가 미션을 완료할 때마다 해당 가게의 `region_id`를 확인합니다.
    2.  서버 내부에서 해당 사용자가 동일 지역에서 완료한 미션의 총개수를 카운트합니다.
    3.  **모든 지역마다 누적 완료 미션이 10개가 될 때마다 1000 point를 즉시 지급**합니다.
    4.  보너스 지급 시 사용자에게 알림을 발송합니다.