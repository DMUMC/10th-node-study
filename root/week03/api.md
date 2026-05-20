
### 1. 회원 가입 (Sign Up)
* **Description**: `USERS` 테이블에 새로운 사용자 정보를 등록합니다.
* **Endpoint**: `POST /api/users`
* **Request Header**: `Content-Type: application/json`
* **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "nickname": "유저",
      "profile_image_url": "https://..."
    }
    ```
* **Query String / Path Variable**: N/A

---

### 2. 홈 화면 조회 (Home Screen)
* **Endpoint**: `GET /api/home`
* **Request Header**: `Authorization: Bearer {token}`
* **Query String / Path Variable**: N/A

---

### 3. 미션 목록 조회 (Mission List)
* **Endpoint**: `GET /api/user-missions`
* **Request Header**: `Authorization: Bearer {token}`
* **Query String**: 
    * `status`: 필터링할 상태값 (예: `challenging` 또는 `complete`)
* **Path Variable**: N/A

---

### 4. 미션 성공 누르기 (Complete Mission)
* **Endpoint**: `PATCH /api/user-missions/{id}/success`
* **Request Header**: `Authorization: Bearer {token}`
* **Path Variable**: `id`
* **Request Body**: N/A 

---

### 5. 리뷰 작성 (Create Review)
* **Endpoint**: `POST /api/reviews`
* **Request Header**: `Authorization: Bearer {token}`, `Content-Type: application/json`
* **Request Body**:
    ```json
    {
      "user_mission_id": 101,
      "store_id": 5,
      "rating": 5,
      "content": "좋아요!",
      "image_url": "https://..."
    }
    ```
* **Query String / Path Variable**: N/A 