-- ============================================================
-- DB 초기화 및 재생성 스크립트
-- ============================================================

CREATE DATABASE IF NOT EXISTS umc_mission DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE umc_mission;

-- FK 체크 비활성화 후 전체 DROP
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS review_image;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS member_mission;
DROP TABLE IF EXISTS mission;
DROP TABLE IF EXISTS store_hours;
DROP TABLE IF EXISTS store_image;
DROP TABLE IF EXISTS store;
DROP TABLE IF EXISTS member_prefer;
DROP TABLE IF EXISTS member_agree;
DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS terms;
DROP TABLE IF EXISTS food_category;
DROP TABLE IF EXISTS region;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 테이블 재생성
-- ============================================================

CREATE TABLE region (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    name       VARCHAR(50)  NOT NULL COMMENT '지역명',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE food_category (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    name       VARCHAR(50)  NOT NULL COMMENT '카테고리명 (한식, 중식, 일식 등)',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE terms (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    title      VARCHAR(100)  NOT NULL COMMENT '약관 제목',
    content    TEXT          NOT NULL COMMENT '약관 내용',
    optional   BOOLEAN       NOT NULL DEFAULT FALSE COMMENT 'TRUE: 선택 동의, FALSE: 필수 동의',
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE member (
    id                BIGINT        NOT NULL AUTO_INCREMENT,
    social_type       VARCHAR(20)   NULL,
    social_id         VARCHAR(100)  NULL,
    email             VARCHAR(100)  NULL,
    password          VARCHAR(255)  NULL,
    name              VARCHAR(50)   NOT NULL,
    nickname          VARCHAR(50)   NOT NULL,
    profile_image_url VARCHAR(500)  NULL,
    phone_num         VARCHAR(20)   NULL,
    phone_verified    BOOLEAN       NOT NULL DEFAULT FALSE,
    birth             DATE          NULL,
    gender            VARCHAR(10)   NULL,
    address           VARCHAR(200)  NULL,
    spec_address      VARCHAR(200)  NULL,
    point             INT           NOT NULL DEFAULT 0,
    status            VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    inactive_date     DATETIME      NULL,
    created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_member_email (email),
    UNIQUE KEY uq_member_social (social_type, social_id)
);

CREATE TABLE member_agree (
    member_id  BIGINT   NOT NULL,
    terms_id   BIGINT   NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (member_id, terms_id),
    CONSTRAINT fk_member_agree_member FOREIGN KEY (member_id) REFERENCES member (id),
    CONSTRAINT fk_member_agree_terms  FOREIGN KEY (terms_id)  REFERENCES terms  (id)
);

CREATE TABLE member_prefer (
    member_id  BIGINT   NOT NULL,
    food_id    BIGINT   NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (member_id, food_id),
    CONSTRAINT fk_member_prefer_member FOREIGN KEY (member_id) REFERENCES member        (id),
    CONSTRAINT fk_member_prefer_food   FOREIGN KEY (food_id)   REFERENCES food_category (id)
);

CREATE TABLE store (
    id               BIGINT        NOT NULL AUTO_INCREMENT,
    region_id        BIGINT        NOT NULL,
    food_category_id BIGINT        NOT NULL,
    name             VARCHAR(100)  NOT NULL,
    description      TEXT          NULL,
    lat              DECIMAL(10,7) NULL,
    lng              DECIMAL(10,7) NULL,
    address          VARCHAR(200)  NOT NULL,
    status           VARCHAR(20)   NOT NULL DEFAULT 'OPEN',
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_store_region   FOREIGN KEY (region_id)        REFERENCES region        (id),
    CONSTRAINT fk_store_category FOREIGN KEY (food_category_id) REFERENCES food_category (id)
);

CREATE TABLE store_image (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    store_id   BIGINT        NOT NULL,
    image_url  VARCHAR(500)  NOT NULL,
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_store_image_store FOREIGN KEY (store_id) REFERENCES store (id)
);

CREATE TABLE store_hours (
    id           BIGINT      NOT NULL AUTO_INCREMENT,
    store_id     BIGINT      NOT NULL,
    day_of_week  VARCHAR(3)  NOT NULL,
    open_time    TIME        NOT NULL,
    close_time   TIME        NOT NULL,
    created_at   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_store_hours_day (store_id, day_of_week),
    CONSTRAINT fk_store_hours_store FOREIGN KEY (store_id) REFERENCES store (id)
);

CREATE TABLE mission (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    store_id   BIGINT        NOT NULL,
    title      VARCHAR(200)  NOT NULL,
    reward     INT           NOT NULL DEFAULT 0,
    spec       VARCHAR(500)  NULL,
    dead_line  DATE          NULL,
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_mission_store FOREIGN KEY (store_id) REFERENCES store (id)
);

CREATE TABLE member_mission (
    id         BIGINT      NOT NULL AUTO_INCREMENT,
    member_id  BIGINT      NOT NULL,
    mission_id BIGINT      NOT NULL,
    status     VARCHAR(20) NOT NULL DEFAULT 'CHALLENGING',
    created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_member_mission (member_id, mission_id),
    CONSTRAINT fk_member_mission_member  FOREIGN KEY (member_id)  REFERENCES member  (id),
    CONSTRAINT fk_member_mission_mission FOREIGN KEY (mission_id) REFERENCES mission (id)
);

CREATE TABLE review (
    id                BIGINT        NOT NULL AUTO_INCREMENT,
    member_id         BIGINT        NOT NULL,
    store_id          BIGINT        NOT NULL,
    member_mission_id BIGINT        NULL,
    content           TEXT          NOT NULL,
    score             DECIMAL(2,1)  NOT NULL,
    owner_reply       VARCHAR(500)  NULL,
    created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_review_member         FOREIGN KEY (member_id)         REFERENCES member         (id),
    CONSTRAINT fk_review_store          FOREIGN KEY (store_id)          REFERENCES store          (id),
    CONSTRAINT fk_review_member_mission FOREIGN KEY (member_mission_id) REFERENCES member_mission (id),
    CONSTRAINT chk_review_score         CHECK (score BETWEEN 1.0 AND 5.0)
);

CREATE TABLE review_image (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    review_id  BIGINT        NOT NULL,
    image_url  VARCHAR(500)  NOT NULL,
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_review_image_review FOREIGN KEY (review_id) REFERENCES review (id)
);

-- ============================================================
-- 시드 데이터 (API 테스트용 초기 데이터)
-- ============================================================

INSERT INTO region (name) VALUES
    ('서울'),
    ('경기'),
    ('인천'),
    ('부산'),
    ('대구');

INSERT INTO food_category (name) VALUES
    ('한식'),
    ('중식'),
    ('일식'),
    ('양식'),
    ('분식'),
    ('카페/디저트'),
    ('치킨'),
    ('피자'),
    ('패스트푸드');
