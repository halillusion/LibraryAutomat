CREATE TABLE
  `books` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) DEFAULT NULL,
    `score` decimal(10, 0) DEFAULT NULL,
    `created_at` datetime DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

insert into `books` (`created_at`, `id`, `name`, `score`) values ('2023-08-27 13:52:02', 1, 'Neuromancer', NULL);
insert into `books` (`created_at`, `id`, `name`, `score`) values ('2023-08-27 13:52:02', 2, 'The Lord of the Rings', '5');
insert into `books` (`created_at`, `id`, `name`, `score`) values ('2023-08-27 13:52:02', 3, '1984', '8');
insert into `books` (`created_at`, `id`, `name`, `score`) values ('2023-08-27 13:53:07', 4, 'Neuromancer II', NULL);
