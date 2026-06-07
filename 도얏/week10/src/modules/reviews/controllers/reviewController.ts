// review 관련 엔드포인트는 StoreController(가게 리뷰 작성/조회)와
// UserController(사용자 리뷰 목록)로 분산 관리합니다.
// - POST /api/v1/stores/:storeId/reviews  → StoreController
// - GET  /api/v1/stores/:storeId/reviews  → StoreController
// - GET  /api/v1/users/:userId/reviews    → UserController
export {}

