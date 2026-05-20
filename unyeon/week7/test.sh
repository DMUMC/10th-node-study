#!/bin/bash
# UMC 5주차 API 테스트 스크립트
# 사용법: bash test.sh

BASE="http://localhost:3000"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

section() {
  echo ""
  echo -e "${BLUE}============================================================${NC}"
  echo -e "${BLUE} $1${NC}"
  echo -e "${BLUE}============================================================${NC}"
}

request() {
  echo -e "${YELLOW}▶ $1${NC}"
  echo -e "${YELLOW}  $2 $3${NC}"
  if [ -n "$4" ]; then
    echo -e "${YELLOW}  Body: $4${NC}"
  fi
  echo ""
}

# =====================================================
section "[0] 회원가입 API (POST /api/v1/members) + bcrypt 해싱"
# =====================================================
request "0-1. 회원가입 성공" "POST" "/api/v1/members" \
'{"email":"unyeon@umc.com","password":"pw1234","name":"언년","nickname":"unyeon"}'
curl -s -X POST $BASE/api/v1/members \
  -H "Content-Type: application/json" \
  -d '{"email":"unyeon@umc.com","password":"pw1234","name":"언년","nickname":"unyeon","gender":"FEMALE","birth":"2000-01-01","phoneNum":"010-1234-5678","address":"서울시","specAddress":"강남구"}' \
  | python -m json.tool --no-ensure-ascii 2>/dev/null || cat
echo ""

request "0-2. 중복 이메일 실패 (MEMBER4001)" "POST" "/api/v1/members" "같은 이메일 재요청"
curl -s -X POST $BASE/api/v1/members \
  -H "Content-Type: application/json" \
  -d '{"email":"unyeon@umc.com","password":"pw1234","name":"a","nickname":"b"}' \
  | python -m json.tool --no-ensure-ascii 2>/dev/null || cat
echo ""

# =====================================================
section "[1] 특정 지역에 가게 추가 (POST /api/v1/regions/:regionId/stores)"
# =====================================================
request "1-1. 가게 생성 성공" "POST" "/api/v1/regions/1/stores" \
'{"foodCategoryId":1,"name":"언년이네 한식당","description":"한식 맛집"}'
curl -s -X POST $BASE/api/v1/regions/1/stores \
  -H "Content-Type: application/json" \
  -d '{"foodCategoryId":1,"name":"언년이네 한식당","description":"한식 맛집","address":"강남구 역삼동"}' \
  | python -m json.tool --no-ensure-ascii 2>/dev/null || cat
echo ""

request "1-2. 없는 지역 실패 (REGION4041)" "POST" "/api/v1/regions/999/stores" "-"
curl -s -X POST $BASE/api/v1/regions/999/stores \
  -H "Content-Type: application/json" \
  -d '{"foodCategoryId":1,"name":"존재X"}' \
  | python -m json.tool --no-ensure-ascii 2>/dev/null || cat
echo ""

# =====================================================
section "[2] ★필수★ 가게에 리뷰 추가 (POST /api/v1/stores/:storeId/reviews)"
# =====================================================
request "2-1. 리뷰 작성 성공" "POST" "/api/v1/stores/1/reviews" \
'{"content":"정말 맛있어요!","score":4.5}'
curl -s -X POST $BASE/api/v1/stores/1/reviews \
  -H "Content-Type: application/json" \
  -d '{"content":"정말 맛있어요! 또 가고 싶네요","score":4.5}' \
  | python -m json.tool --no-ensure-ascii 2>/dev/null || cat
echo ""

request "2-2. 없는 가게 실패 (STORE4041)" "POST" "/api/v1/stores/999/reviews" "-"
curl -s -X POST $BASE/api/v1/stores/999/reviews \
  -H "Content-Type: application/json" \
  -d '{"content":"없는 가게","score":3}' \
  | python -m json.tool --no-ensure-ascii 2>/dev/null || cat
echo ""

# =====================================================
section "[3] 가게에 미션 추가 (POST /api/v1/stores/:storeId/missions)"
# =====================================================
request "3-1. 미션 생성 성공" "POST" "/api/v1/stores/1/missions" \
'{"title":"3만원 이상 주문","reward":500}'
curl -s -X POST $BASE/api/v1/stores/1/missions \
  -H "Content-Type: application/json" \
  -d '{"title":"3만원 이상 주문하기","reward":500,"spec":"1회 방문 시","deadLine":"2026-12-31"}' \
  | python -m json.tool --no-ensure-ascii 2>/dev/null || cat
echo ""

# =====================================================
section "[4] ★필수★ 미션 도전하기 (POST /api/v1/missions/:missionId/challenges)"
# =====================================================
request "4-1. 미션 도전 성공" "POST" "/api/v1/missions/1/challenges" "-"
curl -s -X POST $BASE/api/v1/missions/1/challenges \
  -H "Content-Type: application/json" \
  | python -m json.tool --no-ensure-ascii 2>/dev/null || cat
echo ""

request "4-2. 이미 도전 중 실패 (MISSION4091)" "POST" "/api/v1/missions/1/challenges" "-"
curl -s -X POST $BASE/api/v1/missions/1/challenges \
  -H "Content-Type: application/json" \
  | python -m json.tool --no-ensure-ascii 2>/dev/null || cat
echo ""

request "4-3. 없는 미션 실패 (MISSION4041)" "POST" "/api/v1/missions/999/challenges" "-"
curl -s -X POST $BASE/api/v1/missions/999/challenges \
  -H "Content-Type: application/json" \
  | python -m json.tool --no-ensure-ascii 2>/dev/null || cat
echo ""

echo -e "${GREEN}✓ 모든 API 테스트 완료!${NC}"
