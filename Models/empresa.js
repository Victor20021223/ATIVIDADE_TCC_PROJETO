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
        type: Sequelize.Sequelize.STRING,
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
        validate:{
            is: /^[0-9a-f]{64}$/i
        }
    },
    IMAGEM:{
        type: Sequelize.BLOB,
        allowNull:true
    }
});

Empresa.sync();

module.exports = Empresa;