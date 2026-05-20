-- =============================================
-- UMC 2주차 미션 쿼리 (제공해주신 로직 + 1주차 ERD 스키마 반영)
-- =============================================

-- =============================================
-- 1. 내가 진행중/진행 완료한 미션 목록 조회 (페이징 포함)
-- =============================================
SELECT
    m.c_mis_id          AS mission_id,
    s.c_sto_name        AS store_name,
    m.c_mis_title       AS mission_title,
    m.c_mis_reward      AS point,
    mm.c_mm_status      AS mission_status,
    mm.c_mm_created     AS started_at,
    mm.c_mm_updated     AS completed_at
FROM t_member_mission mm
JOIN t_mission m ON mm.c_mm_mission_id = m.c_mis_id
JOIN t_store s   ON m.c_mis_store_id = s.c_sto_id
WHERE mm.c_mm_member_id = 1              -- 로그인한 유저 id
  AND mm.c_mm_status = 'CHALLENGING'     -- 진행중: 'CHALLENGING' / 진행완료: 'COMPLETE'
ORDER BY mm.c_mm_created DESC
LIMIT 10 OFFSET 0;                       -- 1페이지: OFFSET 0, 2페이지: OFFSET 10

-- 진행완료 탭으로 바꿀 때는 status 조건만 변경
-- AND mm.c_mm_status = 'COMPLETE'


-- =============================================
-- 2. 리뷰 작성 쿼리 (사진 제외)
-- =============================================
INSERT INTO t_review (
    c_rev_member_id,
    c_rev_store_id,
    c_rev_content,
    c_rev_score,
    c_rev_created,
    c_rev_updated
)
SELECT
    mm.c_mm_member_id,
    m.c_mis_store_id,
    '너무 맛있어요! 포인트도 받고 좋았습니다.',   -- 실제로는 유저가 입력한 내용
    4.5,                                       -- 실제로는 유저가 선택한 별점
    NOW(),
    NOW()
FROM t_member_mission mm
JOIN t_mission m ON mm.c_mm_mission_id = m.c_mis_id
WHERE mm.c_mm_member_id = 1                  -- 로그인한 유저 id (본인 미션만 작성 가능)
  AND mm.c_mm_mission_id = 1                 -- 리뷰 작성할 미션 id
  AND mm.c_mm_status = 'COMPLETE';           -- 완료된 미션만 리뷰 작성 가능

-- 리뷰 작성 후 해당 가게의 평균 별점 업데이트
-- (참고: 현재 ERD의 t_store에는 별점 컬럼이 없으나, 'c_sto_score' 컬럼이 있다고 가정)
/*
UPDATE t_store s
SET c_sto_score = (
    SELECT AVG(r.c_rev_score)
    FROM t_review r
    WHERE r.c_rev_store_id = s.c_sto_id
)
WHERE s.c_sto_id = (
    SELECT m.c_mis_store_id
    FROM t_mission m
    WHERE m.c_mis_id = 1
);
*/


-- =============================================
-- 3. 홈 화면 - 현재 선택된 지역에서 도전 가능한 미션 목록 (페이징 포함)
-- =============================================

-- 3-1. 현재 지역 완료 미션 수 (상단 7/10 표시용)
SELECT COUNT(*) AS complete_count
FROM t_member_mission mm
JOIN t_mission m ON mm.c_mm_mission_id = m.c_mis_id
JOIN t_store s   ON m.c_mis_store_id = s.c_sto_id
WHERE mm.c_mm_member_id = 1              -- 로그인한 유저 id
  AND s.c_sto_region_id = 1              -- 현재 선택된 지역 id
  AND mm.c_mm_status = 'COMPLETE';

-- 3-2. 현재 지역에서 도전 가능한 미션 목록 (아직 도전 안 한 미션)
SELECT
    m.c_mis_id          AS mission_id,
    s.c_sto_name        AS store_name,
    fc.c_fc_name        AS category,
    m.c_mis_title       AS mission_title,
    m.c_mis_reward      AS point,
    m.c_mis_deadline    AS deadline
FROM t_mission m
JOIN t_store s            ON m.c_mis_store_id = s.c_sto_id
JOIN t_food_category fc   ON s.c_sto_fc_id = fc.c_fc_id
WHERE s.c_sto_region_id = 1                    -- 현재 선택된 지역 id
  AND s.c_sto_status = 'OPEN'                  -- 상점 오픈 상태 가정
  AND m.c_mis_id NOT IN (                      -- 내가 이미 도전중이거나 완료한 미션 제외
      SELECT c_mm_mission_id
      FROM t_member_mission
      WHERE c_mm_member_id = 1                 -- 로그인한 유저 id
  )
ORDER BY m.c_mis_created DESC
LIMIT 10 OFFSET 0;                             -- 1페이지: OFFSET 0, 2페이지: OFFSET 10


-- =============================================
-- 4. 마이페이지 화면 쿼리
-- =============================================
SELECT
    u.c_mem_nickname AS nickname,
    u.c_mem_social_id AS email,              -- 이메일 전용 컬럼 부재로 소셜 계정 ID 매핑
    u.c_mem_phone_num AS phone,
    u.c_mem_profile_image_url AS profile_img,
    u.c_mem_point AS point,
    COUNT(r.c_rev_id) AS review_count        -- 작성한 리뷰 수
FROM t_member u
LEFT JOIN t_review r ON r.c_rev_member_id = u.c_mem_id
WHERE u.c_mem_id = 1                         -- 로그인한 유저 id
GROUP BY u.c_mem_id;
