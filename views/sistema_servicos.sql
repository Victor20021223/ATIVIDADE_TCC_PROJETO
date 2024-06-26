DROP TABLE IF EXISTS `servicos`;

CREATE TABLE `servicos` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `DESCRICAO` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SOBRE` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `VALOR` float NOT NULL,
  `SITUACAO` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` time NOT NULL,
  `updatedAt` time NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

