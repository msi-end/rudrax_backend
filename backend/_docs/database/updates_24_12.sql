ALTER TABLE `collections` CHANGE `col_project_id` `col_project_id` VARCHAR(55) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL;
ALTER TABLE `collections` CHANGE `col_project_id` `col_project_id` BIGINT NULL DEFAULT NULL;
ALTER TABLE `collections` ADD FOREIGN KEY (`col_project_id`) REFERENCES `projects`(`pro_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `expenses` CHANGE `exp_project_ref` `exp_project_id` BIGINT NULL DEFAULT NULL;


CREATE TABLE `site_inspection_emp` (
 `siemp_id` bigint NOT NULL AUTO_INCREMENT,
 `siemp_project_id` bigint NOT NULL,
 `siemp_user_id` bigint NOT NULL,
 `siemp_assigned_date` datetime DEFAULT CURRENT_TIMESTAMP,
 `siemp_assigned_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
 `siemp_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
 `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
 `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`siemp_id`),
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci


ALTER TABLE `site_inspection_emp` ADD FOREIGN KEY (`siemp_project_id`) REFERENCES `projects`(`pro_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `site_inspection_emp` ADD FOREIGN KEY (`siemp_user_id`) REFERENCES `users`(`u_id`) ON DELETE CASCADE ON UPDATE CASCADE;



CREATE TABLE `project_expenses` (
 `exp_id` int NOT NULL AUTO_INCREMENT,
 `exp_type` enum('personal','firm','project') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'firm',
 `exp_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
 `exp_amount` varchar(55) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
 `exp_mode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
 `exp_status` enum('paid','unpaid','pending') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'paid',
 `exp_attachment_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
 `exp_remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
 `exp_paid_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
 `exp_date` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
 `exp_category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
 `exp_project_id` bigint DEFAULT NULL,
 `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`exp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci




ALTER TABLE `project_expenses` CHANGE `exp_type` `exp_type` ENUM('personal','firm','project') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'project';

ALTER TABLE `project_expenses` ADD `exp_project_phase` VARCHAR(155) NULL DEFAULT NULL AFTER `exp_project_id`;

ALTER TABLE `project_expenses` ADD FOREIGN KEY (`exp_project_id`) REFERENCES `projects`(`pro_id`) ON DELETE CASCADE ON UPDATE CASCADE;

	CREATE TABLE `query_emp` (
 `qemp_id` bigint NOT NULL AUTO_INCREMENT,
 `qemp_project_id` bigint NOT NULL,
 `qemp_user_id` bigint NOT NULL,
 `qemp_assigned_date` datetime DEFAULT CURRENT_TIMESTAMP,
 `qemp_assigned_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
 `qemp_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
 `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
 `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`qemp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci



ALTER TABLE `query_emp` ADD FOREIGN KEY (`qemp_project_id`) REFERENCES `projects`(`pro_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `query_emp` ADD FOREIGN KEY (`qemp_user_id`) REFERENCES `users`(`u_id`) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE `query_emp` CHANGE `qemp_project_id` `qemp_query_id` BIGINT NOT NULL;


ALTER TABLE `query_emp` DROP FOREIGN KEY `query_emp_ibfk_1`; 
ALTER TABLE `query_emp` ADD CONSTRAINT `query_emp_ibfk_1` FOREIGN KEY (`qemp_query_id`) REFERENCES `project_queries`(`q_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `site_inspection_emp` CHANGE `siemp_project_id` `siemp_siteInspection_id` BIGINT NOT NULL;
ALTER TABLE `site_inspection_emp` DROP FOREIGN KEY `site_inspection_emp_ibfk_1`;
ALTER TABLE `site_inspection_emp` ADD CONSTRAINT `site_inspection_emp_ibfk_1` FOREIGN KEY (`siemp_siteInspection_id`) REFERENCES `site_inspections`(`si_id`) ON DELETE CASCADE ON UPDATE CASCADE;