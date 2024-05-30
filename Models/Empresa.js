const Sequelize = require('sequelize');
const db = require('./db');
const sequelize = require('./db');

const empresa = sequelize.define('empresas', {
    ID: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    NOME: {
      type: Sequelize.STRING,
      allowNull: false
    },
    CNPJ: {
      type: Sequelize.STRING,
      allowNull: false
    },
    EMAIL:{
      type: Sequelize.STRING,
      allowNull:true
    },
    TELEFONE:{
        type: Sequelize.STRING,
        allowNull:true
    },
    LOGRADOURO:{
        type: Sequelize.STRING,
        allowNull:true
    },
    NUMERO:{
        type: Sequelize.STRING,
        allowNull:true
    },
    BAIRRO:{
        type: Sequelize.STRING,
        allowNull:true
    },
    SENHA:{
        type: Sequelize.STRING,
        allowNull:true
    },
    start:{
      type:Sequelize.DATE
    },
    end:{
      type:Sequelize.DATE
    }
  });
  
  // Sincronize o modelo com o banco de dados
  sequelize.sync();
  
  module.exports = empresa;