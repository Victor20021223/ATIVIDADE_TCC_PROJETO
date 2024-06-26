DROP TABLE IF EXISTS `eventos`;

CREATE TABLE `eventos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUser` int NOT NULL,
  `service` int DEFAULT NULL,
  `professional` int DEFAULT NULL,
  `horario` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `start` date DEFAULT NULL,
  `end` date DEFAULT NULL,
  `situacao` char(1) COLLATE utf8mb4_unicode_ci DEFAULT 'A',
  PRIMARY KEY (`id`),
  KEY `eventos_profissional_ID_idx` (`professional`),
  KEY `eventos_horarios_ID_idx` (`horario`),
  KEY `eventos_servicos_ID` (`service`),
  CONSTRAINT `eventos_horarios_ID` FOREIGN KEY (`horario`) REFERENCES `horarios` (`ID`),
  CONSTRAINT `eventos_profissional_ID` FOREIGN KEY (`professional`) REFERENCES `profissionais` (`ID`),
  CONSTRAINT `eventos_servicos_ID` FOREIGN KEY (`service`) REFERENCES `servicos` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

