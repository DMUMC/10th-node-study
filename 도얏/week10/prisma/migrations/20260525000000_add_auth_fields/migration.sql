-- AlterTable: User 테이블에 인증 관련 필드 추가 및 선택 필드 optional 처리
ALTER TABLE `user`
  ADD COLUMN `nickname` VARCHAR(50) NULL AFTER `name`,
  ADD COLUMN `password` VARCHAR(255) NULL AFTER `nickname`,
  MODIFY COLUMN `gender`       VARCHAR(15)  NULL,
  MODIFY COLUMN `birth`        DATE         NULL,
  MODIFY COLUMN `address`      VARCHAR(255) NULL,
  MODIFY COLUMN `phone_number` VARCHAR(15)  NULL;
