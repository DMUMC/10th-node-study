-- ============================================================
-- UMC 미션 서비스 - MySQL DDL
-- 기반: week1 ERD + week3 API 명세
-- ============================================================

CREATE DATABASE IF NOT EXISTS umc_mission DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE umc_mission;

-- ============================================================
-- 1. region (지역)
-- ============================================================
CREATE TABLE region (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    name       VARCHAR(50)  NOT NULL COMMENT '지역명',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- ============================================================
-- 2. food_category (음식 카테고리)
-- ============================================================
CREATE TABLE food_category (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    name       VARCHAR(50)  NOT NULL COMMENT '카테고리명 (한식, 중식, 일식 등)',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- ============================================================
-- 3. terms (약관)
-- ============================================================
CREATE TABLE terms (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    title      VARCHAR(100)  NOT NULL COMMENT '약관 제목',
    content    TEXT          NOT NULL COMMENT '약관 내용',
    optional   BOOLEAN       NOT NULL DEFAULT FALSE COMMENT 'TRUE: 선택 동의, FALSE: 필수 동의',
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- ============================================================
-- 4. member (회원)
--    - social_type / social_id: 소셜 로그인 (kakao, naver, google 등)
--    - email / password: 일반 이메일 로그인 (week3 API 명세 반영)
--    - status: ACTIVE | INACTIVE | BANNED
--    - gender: MALE | FEMALE | OTHER
-- ============================================================
CREATE TABLE member (
    id                BIGINT        NOT NULL AUTO_INCREMENT,
    social_type       VARCHAR(20)   NULL     COMMENT '소셜 로그인 타입 (kakao, naver, google)',
    social_id         VARCHAR(100)  NULL     COMMENT '소셜 고유 ID',
    email             VARCHAR(100)  NULL     COMMENT '이메일 (일반 로그인)',
    password          VARCHAR(255)  NULL     COMMENT '비밀번호 해시 (일반 로그인)',
    name              VARCHAR(50)   NOT NULL COMMENT '실명',
    nickname          VARCHAR(50)   NOT NULL COMMENT '닉네임',
    profile_image_url VARCHAR(500)  NULL     COMMENT '프로필 이미지 URL',
    phone_num         VARCHAR(20)   NULL     COMMENT '전화번호',
    phone_verified    BOOLEAN       NOT NULL DEFAULT FALSE COMMENT '전화번호 인증 여부',
    birth             DATE          NULL     COMMENT '생년월일',
    gender            VARCHAR(10)   NULL     COMMENT 'MALE | FEMALE | OTHER',
    address           VARCHAR(200)  NULL     COMMENT '기본 주소',
    spec_address      VARCHAR(200)  NULL     COMMENT '상세 주소',
    point             INT           NOT NULL DEFAULT 0 COMMENT '보유 포인트',
    status            VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE | INACTIVE | BANNED',
    inactive_date     DATETIME      NULL     COMMENT '비활성화 일시',
    created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_member_email (email),
    UNIQUE KEY uq_member_social (social_type, social_id)
);

-- ============================================================
-- 5. member_agree (회원 약관 동의)
-- ============================================================
CREATE TABLE member_agree (
    member_id  BIGINT   NOT NULL,
    terms_id   BIGINT   NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (member_id, terms_id),
    CONSTRAINT fk_member_agree_member FOREIGN KEY (member_id) REFERENCES member (id),
    CONSTRAINT fk_member_agree_terms  FOREIGN KEY (terms_id)  REFERENCES terms  (id)
);

-- ============================================================
-- 6. member_prefer (회원 음식 카테고리 선호)
-- ============================================================
CREATE TABLE member_prefer (
    member_id  BIGINT   NOT NULL,
    food_id    BIGINT   NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (member_id, food_id),
    CONSTRAINT fk_member_prefer_member FOREIGN KEY (member_id) REFERENCES member        (id),
    CONSTRAINT fk_member_prefer_food   FOREIGN KEY (food_id)   REFERENCES food_category (id)
);

-- ============================================================
-- 7. store (가게)
--    - status: OPEN | CLOSED | PENDING
-- ============================================================
CREATE TABLE store (
    id               BIGINT        NOT NULL AUTO_INCREMENT,
    region_id        BIGINT        NOT NULL,
    food_category_id BIGINT        NOT NULL,
    name             VARCHAR(100)  NOT NULL COMMENT '가게명',
    description      TEXT          NULL     COMMENT '가게 설명',
    lat              DECIMAL(10,7) NULL     COMMENT '위도',
    lng              DECIMAL(10,7) NULL     COMMENT '경도',
    address          VARCHAR(200)  NOT NULL COMMENT '주소',
    status           VARCHAR(20)   NOT NULL DEFAULT 'OPEN' COMMENT 'OPEN | CLOSED | PENDING',
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_store_region   FOREIGN KEY (region_id)        REFERENCES region        (id),
    CONSTRAINT fk_store_category FOREIGN KEY (food_category_id) REFERENCES food_category (id)
);

-- ============================================================
-- 8. store_image (가게 이미지)
-- ============================================================
CREATE TABLE store_image (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    store_id   BIGINT        NOT NULL,
    image_url  VARCHAR(500)  NOT NULL COMMENT '이미지 URL',
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_store_image_store FOREIGN KEY (store_id) REFERENCES store (id)
);

-- ============================================================
-- 9. store_hours (가게 영업 시간)
--    - day_of_week: MON | TUE | WED | THU | FRI | SAT | SUN
-- ============================================================
CREATE TABLE store_hours (
    id           BIGINT      NOT NULL AUTO_INCREMENT,
    store_id     BIGINT      NOT NULL,
    day_of_week  VARCHAR(3)  NOT NULL COMMENT 'MON | TUE | WED | THU | FRI | SAT | SUN',
    open_time    TIME        NOT NULL COMMENT '영업 시작 시간',
    close_time   TIME        NOT NULL COMMENT '영업 종료 시간',
    created_at   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_store_hours_day (store_id, day_of_week),
    CONSTRAINT fk_store_hours_store FOREIGN KEY (store_id) REFERENCES store (id)
);

-- ============================================================
-- 10. mission (미션)
-- ============================================================
CREATE TABLE mission (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    store_id   BIGINT        NOT NULL,
    title      VARCHAR(200)  NOT NULL COMMENT '미션 제목',
    reward     INT           NOT NULL DEFAULT 0 COMMENT '완료 시 지급 포인트',
    spec       VARCHAR(500)  NULL     COMMENT '미션 상세 조건',
    dead_line  DATE          NULL     COMMENT '미션 마감일',
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_mission_store FOREIGN KEY (store_id) REFERENCES store (id)
);

-- ============================================================
-- 11. member_mission (회원 미션 수행 기록)
--    - status: CHALLENGING | COMPLETE
--    - surrogate PK(id) 사용: review에서 FK 참조 가능하도록
--      (week3 API: /members/me/missions/{memberMissionId}/reviews)
-- ============================================================
CREATE TABLE member_mission (
    id         BIGINT      NOT NULL AUTO_INCREMENT,
    member_id  BIGINT      NOT NULL,
    mission_id BIGINT      NOT NULL,
    status     VARCHAR(20) NOT NULL DEFAULT 'CHALLENGING' COMMENT 'CHALLENGING | COMPLETE',
    created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_member_mission (member_id, mission_id),
    CONSTRAINT fk_member_mission_member  FOREIGN KEY (member_id)  REFERENCES member  (id),
    CONSTRAINT fk_member_mission_mission FOREIGN KEY (mission_id) REFERENCES mission (id)
);

-- ============================================================
-- 12. review (리뷰)
--    - member_mission_id: 완료된 미션 수행 기록과 연결
--      (week3 API: POST /members/me/missions/{memberMissionId}/reviews)
--    - score: 1.0 ~ 5.0 (소수점 첫째 자리)
-- ============================================================
CREATE TABLE review (
    id                 BIGINT        NOT NULL AUTO_INCREMENT,
    member_id          BIGINT        NOT NULL,
    store_id           BIGINT        NOT NULL,
    member_mission_id  BIGINT        NULL     COMMENT '연결된 미션 수행 기록 (선택)',
    content            TEXT          NOT NULL COMMENT '리뷰 내용',
    score              DECIMAL(2,1)  NOT NULL COMMENT '별점 (1.0 ~ 5.0)',
    owner_reply        VARCHAR(500)  NULL     COMMENT '사장님 답글',
    created_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_review_member         FOREIGN KEY (member_id)         REFERENCES member         (id),
    CONSTRAINT fk_review_store          FOREIGN KEY (store_id)          REFERENCES store          (id),
    CONSTRAINT fk_review_member_mission FOREIGN KEY (member_mission_id) REFERENCES member_mission (id),
    CONSTRAINT chk_review_score         CHECK (score BETWEEN 1.0 AND 5.0)
);

-- ============================================================
-- 13. review_image (리뷰 이미지)
--    - week3 API의 image_url 필드 저장 (다중 이미지 지원)
-- ============================================================
CREATE TABLE review_image (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    review_id  BIGINT        NOT NULL,
    image_url  VARCHAR(500)  NOT NULL COMMENT '이미지 URL',
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_review_image_review FOREIGN KEY (review_id) REFERENCES review (id)
);
