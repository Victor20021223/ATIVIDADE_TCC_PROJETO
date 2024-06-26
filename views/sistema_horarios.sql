DROP TABLE IF EXISTS `horarios`;

CREATE TABLE `horarios` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `HORA_LIVRE` time NOT NULL,
  `createdAt` time NOT NULL,
  `updatedAt` time NOT NULL,
  `SITUACAO` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT 'L',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

