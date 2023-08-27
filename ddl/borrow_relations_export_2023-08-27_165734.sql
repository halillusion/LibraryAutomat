CREATE TABLE
  `borrow_relations` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int DEFAULT NULL,
    `book_id` int DEFAULT NULL,
    `score` decimal(10, 0) DEFAULT NULL,
    `created_at` datetime DEFAULT NULL,
    `updated_at` datetime DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

insert into `borrow_relations` (`book_id`, `created_at`, `id`, `score`, `updated_at`, `user_id`) values (3, '2023-08-27 13:53:13', 1, '8', '2023-08-27 13:53:53', 1);
insert into `borrow_relations` (`book_id`, `created_at`, `id`, `score`, `updated_at`, `user_id`) values (2, '2023-08-27 13:53:22', 2, '8', '2023-08-27 13:53:48', 1);
insert into `borrow_relations` (`book_id`, `created_at`, `id`, `score`, `updated_at`, `user_id`) values (2, '2023-08-27 13:54:13', 3, '2', '2023-08-27 13:55:07', 2);
