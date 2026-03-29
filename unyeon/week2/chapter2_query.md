# 2주차 미션 SQL 쿼리

## 1. 내가 진행중 / 진행 완료한 미션 모아서 보는 쿼리 (페이징 포함)

```sql
SELECT
    mm.mission_id,
    s.name          AS store_name,
    m.title         AS mission_title,
    m.spec          AS mission_spec,
    m.reward,
    m.dead_line,
    mm.status,
    mm.created_at
FROM member_mission mm
JOIN mission m ON mm.mission_id = m.id
JOIN store   s ON m.store_id    = s.id
WHERE mm.member_id = :memberId
  AND mm.status IN ('CHALLENGING', 'COMPLETE')
ORDER BY
    CASE mm.status
        WHEN 'CHALLENGING' THEN 0
        ELSE 1
    END,
    mm.created_at DESC
LIMIT :limit OFFSET :offset;
```

## 2. 리뷰 작성하는 쿼리 (사진 배제)

```sql
INSERT INTO review (member_id, store_id, content, score, created_at, updated_at)
VALUES (:memberId, :storeId, :content, :score, NOW(), NOW());
```

## 3. 홈 화면 쿼리 - 선택된 지역에서 도전 가능한 미션 목록 (페이징 포함)

```sql
SELECT
    m.id                        AS mission_id,
    s.name                      AS store_name,
    s.address                   AS store_address,
    ROUND(AVG(r.score), 1)      AS store_rating,
    m.title                     AS mission_title,
    m.spec                      AS mission_spec,
    m.reward,
    m.dead_line
FROM mission m
JOIN store s ON m.store_id = s.id
LEFT JOIN review r ON r.store_id = s.id
WHERE s.region_id = :regionId
  AND (m.dead_line IS NULL OR m.dead_line >= CURDATE())
  AND m.id NOT IN (
      SELECT mission_id
      FROM member_mission
      WHERE member_id = :memberId
  )
GROUP BY
    m.id, s.name, s.address, m.title, m.spec, m.reward, m.dead_line, m.created_at
ORDER BY m.created_at DESC
LIMIT :limit OFFSET :offset;
```

## 4. 마이 페이지 화면 쿼리

```sql
SELECT
    mem.id,
    mem.name,
    mem.nickname,
    mem.profile_image_url,
    mem.phone_num,
    mem.point,
    COUNT(CASE WHEN mm.status = 'COMPLETE'    THEN 1 END) AS completed_mission_count,
    COUNT(CASE WHEN mm.status = 'CHALLENGING' THEN 1 END) AS ongoing_mission_count,
    (SELECT COUNT(*) FROM review rv WHERE rv.member_id = mem.id) AS review_count
FROM member mem
LEFT JOIN member_mission mm ON mem.id = mm.member_id
WHERE mem.id = :memberId
GROUP BY mem.id;
```
