const Sequelize = require('sequelize');
const db = require('./db');
const sequelize = require('./db');

const Servicos = db.define('servicos',{
    ID:{
        type: Sequelize.DataTypes.INTEGER,
        required:true,
        primaryKey:true,
        autoIncrement: true,
        allowNull:false
    },
    DESCRICAO:{
        type:Sequelize.STRING,
        required:true,
        allowNull:false
    },
    SOBRE:{
        type:Sequelize.STRING,
        required:true,
        allowNull:true
    },
    VALOR:{
        type:Sequelize.FLOAT,
        allowNull:false,
        required:true
    },
    SITUACAO:{
        type:Sequelize.CHAR,
        allowNull:false,
        required:true
    }

});

Servicos.sync();

module.exports = Servicos;