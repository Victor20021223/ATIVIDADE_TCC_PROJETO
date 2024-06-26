DROP TABLE IF EXISTS `planos`;

CREATE TABLE `planos` (
  `ID` int NOT NULL,
  `DESCRICAO` varchar(45) COLLATE utf8mb3_unicode_ci NOT NULL,
  `VALOR` varchar(45) COLLATE utf8mb3_unicode_ci NOT NULL,
  `DIAS_AGENDAMENTOS` datetime NOT NULL,
  `INTERVALO_DIAS` int NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

