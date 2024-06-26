DROP TABLE IF EXISTS `cancelamento_evento`;

CREATE TABLE `cancelamento_evento` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `MOTIVO` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `idUsers` int DEFAULT NULL,
  `IdEventos` int DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

