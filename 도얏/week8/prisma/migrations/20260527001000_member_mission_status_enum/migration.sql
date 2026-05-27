UPDATE `member_mission`
SET `status` = 'CHALLENGING'
WHERE `status` IN ('진행중', 'CHALLENGING');

UPDATE `member_mission`
SET `status` = 'COMPLETE'
WHERE `status` IN ('완료', 'COMPLETE');

ALTER TABLE `member_mission`
  MODIFY COLUMN `status` ENUM('CHALLENGING', 'COMPLETE') NOT NULL DEFAULT 'CHALLENGING';
