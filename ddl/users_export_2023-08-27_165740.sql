CREATE TABLE
  `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) DEFAULT NULL,
    `created_at` datetime DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

insert into `users` (`created_at`, `id`, `name`) values ('2023-08-27 13:52:02', 1, 'Esin Öner');
insert into `users` (`created_at`, `id`, `name`) values ('2023-08-27 13:52:02', 2, 'Halil İbrahim Erçelik');
insert into `users` (`created_at`, `id`, `name`) values ('2023-08-27 13:52:27', 3, 'Ali Fuatpaşa');
