-- 1. 내 미션 목록
SELECT
    um.id AS user_mission_id,
    s.name AS store_name,
    m.title AS mission_title,
    m.description,
    um.status,
    um.completed_at,
    CASE WHEN r.id IS NOT NULL THEN TRUE ELSE FALSE END AS has_review
FROM USER_MISSIONS um
JOIN MISSIONS m ON um.mission_id = m.id
JOIN STORES s ON m.store_id = s.id
LEFT JOIN REVIEWS r ON r.user_mission_id = um.id
WHERE um.user_id = ?
  AND um.status IN ('IN_PROGRESS', 'COMPLETED')
ORDER BY um.created_at DESC
LIMIT 10 OFFSET ?;


-- 2. 리뷰 작성
INSERT INTO REVIEWS (
    user_id,
    store_id,
    user_mission_id,
    rating,
    content,
    image_url,
    created_at,
    updated_at
)
VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW());





-- 3. 홈 화면 - 도전 가능한 미션 목록
SELECT
    m.id,
    m.title,
    m.description,
    s.name AS store_name,
    s.category
FROM MISSIONS m
JOIN STORES s ON m.store_id = s.id
WHERE m.region_id = ?
  AND m.id NOT IN (
      SELECT mission_id
      FROM USER_MISSIONS
      WHERE user_id = ?
  )
ORDER BY m.created_at DESC
LIMIT 10 OFFSET ?;


-- 4. 마이페이지
SELECT
    u.nickname,
    u.email,
    u.profile_image_url,
    COUNT(r.id) AS review_count
FROM USERS u
LEFT JOIN REVIEWS r ON r.user_id = u.id
WHERE u.id = ?
  AND u.is_deleted = 0
GROUP BY u.id;