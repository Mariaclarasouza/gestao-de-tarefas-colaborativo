/*
-- Query: SHOW CREATE TABLE users
-- Date: 2025-05-27 14:46
*/
INSERT INTO `` (`Table`,`Create Table`) VALUES ('users','CREATE TABLE `users` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `first_name` varchar(100) DEFAULT NULL,\n  `last_name` varchar(100) DEFAULT NULL,\n  `email` varchar(255) NOT NULL,\n  `password` varchar(255) NOT NULL,\n  `role` enum(\'admin\',\'member\') NOT NULL DEFAULT \'member\',\n  `entity_id` int DEFAULT NULL,\n  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,\n  `premium` tinyint(1) DEFAULT \'0\',\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `email` (`email`),\n  KEY `entity_id` (`entity_id`),\n  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`entity_id`) REFERENCES `entities` (`id`) ON DELETE SET NULL\n) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci');
