const Sequelize = require('sequelize');
const db = require('./db');

const Empresa = db.define('empresas',{
    ID:{
        type: Sequelize.INTEGER,
        allowNull:false,
        unique:true,
        autoIncrement: true,
        primaryKey:true
    },
    NOME:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    CNPJ:{
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
    },
    EMAIL:{
        type: Sequelize.STRING,
        allowNull:true
    },
    SENHA:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    IMAGEM:{
        type: Sequelize.BLOB,
        allowNull:true
    },
    LOGRADOURO:{
        type:Sequelize.STRING,
        allowNull:false
    },
    NUMERO:{
        type:Sequelize.STRING,
        allowNull:false
    },
    BAIRRO:{
        type:Sequelize.STRING,
        allowNull:false
    },
    TELEFONE:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

Empresa.sync();

module.exports = Empresa;