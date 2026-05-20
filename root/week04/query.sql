CREATE TABLE USERS (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    nickname   VARCHAR(100) NOT NULL,
    profile_image_url VARCHAR(512),
    is_deleted BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE USER_PREFERENCES (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    user_id    BIGINT       NOT NULL,
    category   VARCHAR(100) NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES USERS (id)
);

CREATE TABLE REGIONS (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100) NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE STORES (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    region_id   BIGINT       NOT NULL,
    name        VARCHAR(255) NOT NULL,
    address     VARCHAR(512) NOT NULL,
    category    VARCHAR(100) NOT NULL,
    description TEXT,
    image_url   VARCHAR(512),
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (region_id) REFERENCES REGIONS (id)
);

CREATE TABLE MISSIONS (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    region_id   BIGINT       NOT NULL,
    store_id    BIGINT       NOT NULL,
    title       VARCHAR(255) NOT NULL,
    description VARCHAR(512),
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (region_id) REFERENCES REGIONS (id),
    FOREIGN KEY (store_id)  REFERENCES STORES (id)
);

CREATE TABLE USER_MISSIONS (
    id           BIGINT      NOT NULL AUTO_INCREMENT,
    user_id      BIGINT      NOT NULL,
    mission_id   BIGINT      NOT NULL,
    status       ENUM('IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'IN_PROGRESS',
    completed_at DATETIME,
    created_at   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)    REFERENCES USERS (id),
    FOREIGN KEY (mission_id) REFERENCES MISSIONS (id)
);

CREATE TABLE REVIEWS (
    id              BIGINT   NOT NULL AUTO_INCREMENT,
    user_id         BIGINT   NOT NULL,
    store_id        BIGINT   NOT NULL,
    user_mission_id BIGINT   NOT NULL UNIQUE,   -- 미션당 리뷰 1개 강제
    rating          TINYINT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
    content         TEXT,
    image_url       VARCHAR(512),
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)         REFERENCES USERS (id),
    FOREIGN KEY (store_id)        REFERENCES STORES (id),
    FOREIGN KEY (user_mission_id) REFERENCES USER_MISSIONS (id)
);