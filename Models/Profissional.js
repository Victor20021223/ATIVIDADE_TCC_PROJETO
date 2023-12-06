const Sequelize = require('sequelize');
const db = require('./db');
const sequelize = require('./db');

const Profissional = db.define('profissionais',{
    ID:{
        type: Sequelize.DataTypes.INTEGER,
        required:true,
        primaryKey:true,
        autoIncrement: true,
        allowNull:false
    },
    NOME:{
        type:Sequelize.STRING,
        allowNull:false,
        required:true
    },
    FUNCAO:{
        type:Sequelize.STRING,
        allowNull:false,
        required:true
    },
    CONTATO:{
        type:Sequelize.STRING,
        allowNull:true,
        required:true
    },
    SITUACAO:{
        type:Sequelize.CHAR,
        allowNull:false,
        required:true
    }
})

Profissional.sync();


module.exports = Profissional;