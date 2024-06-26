DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `NOME` varchar(45) COLLATE utf8mb3_unicode_ci NOT NULL,
  `EMAIL` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `SENHA` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `GENERO` varchar(45) COLLATE utf8mb3_unicode_ci NOT NULL,
  `CELULAR` varchar(45) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`),
  UNIQUE KEY `EMAIL_UNIQUE` (`EMAIL`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

