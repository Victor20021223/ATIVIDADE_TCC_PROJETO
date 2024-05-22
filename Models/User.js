const Sequelize = require('sequelize');
const db = require('./db');
const sequelize = require('./db');

const User = db.define( 'users',{
    ID:{
        type: Sequelize.DataTypes.INTEGER,
        required:true,
        primaryKey:true,
        autoIncrement: true,
        allowNull:false
    },
    NOME:{
        type: Sequelize.STRING,
        allowNull:false,
        required:true
    },
    CELULAR:{
        type: Sequelize.STRING,
        required:true,
        allowNull:false,
    },
    EMAIL:{
        type: Sequelize.STRING,
        required:true,
        allowNull:false,
        unique:true
    },
    SENHA:{
        type: Sequelize.STRING(255),
        allowNull:false,
        required:true,
    },
    GENERO:{
        type: Sequelize.STRING,
        allowNull:false,
        required:true
    }
});

//Criat Tabela caso não exista
User.sync();


module.exports = User;


