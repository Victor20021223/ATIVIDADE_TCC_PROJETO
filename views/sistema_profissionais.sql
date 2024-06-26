DROP TABLE IF EXISTS `profissionais`;

CREATE TABLE `profissionais` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `NOME` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `FUNCAO` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CONTATO` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SITUACAO` char(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `createdAt` time NOT NULL,
  `updatedAt` time NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
