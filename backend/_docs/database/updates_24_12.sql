ALTER TABLE `collections` CHANGE `col_project_id` `col_project_id` VARCHAR(55) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL;
ALTER TABLE `collections` CHANGE `col_project_id` `col_project_id` BIGINT NULL DEFAULT NULL;
ALTER TABLE `collections` ADD FOREIGN KEY (`col_project_id`) REFERENCES `projects`(`pro_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `expenses` CHANGE `exp_project_ref` `exp_project_id` BIGINT NULL DEFAULT NULL;
