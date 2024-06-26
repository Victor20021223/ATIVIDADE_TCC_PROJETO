DROP TABLE IF EXISTS `empresas`;

CREATE TABLE `empresas` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `NOME` varchar(45) COLLATE utf8mb3_unicode_ci NOT NULL,
  `CNPJ` varchar(14) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `EMAIL` varchar(45) COLLATE utf8mb3_unicode_ci NOT NULL,
  `TELEFONE` varchar(45) COLLATE utf8mb3_unicode_ci NOT NULL,
  `LOGRADOURO` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `NUMERO` varchar(10) COLLATE utf8mb3_unicode_ci NOT NULL,
  `BAIRRO` varchar(45) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `SENHA` varchar(45) COLLATE utf8mb3_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`),
  UNIQUE KEY `CNPJ_UNIQUE` (`CNPJ`),
  UNIQUE KEY `TELEFONE_UNIQUE` (`TELEFONE`),
  UNIQUE KEY `NUMERO_UNIQUE` (`NUMERO`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
