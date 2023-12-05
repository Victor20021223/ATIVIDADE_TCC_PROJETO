const Sequelize = require('sequelize');
const db = require('./db');

const User = db.define( 'users',{
    nome:{
        type: Sequelize.STRING,
        allowNull:false,
        required:true
    },
    celular:{
        type: Sequelize.STRING,
        required:true,
        allowNull:false,
        validate: {
            len: [8, 11]
          }
    },
    email:{
        type: Sequelize.STRING,
        required:true,
        allowNull:false,
        unique:true
    },
    senha:{
        type: Sequelize.STRING,
        allowNull:false,
        required:true
    },
    genero:{
        type: Sequelize.STRING,
        allowNull:false,
        required:true
    }
});

User.sync();

module.exports = User;


