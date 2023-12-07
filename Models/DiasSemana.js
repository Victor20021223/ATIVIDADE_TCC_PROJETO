const Sequelize = require('sequelize');
const db = require('./db');
const sequelize = require('./db');

const DiasSemana = db.define('dias_semana',{
    ID:{
        type: Sequelize.DataTypes.INTEGER,
        required:true,
        primaryKey:true,
        autoIncrement: true,
        allowNull:false
    },
    DIAS_SEMANAS:{
        type:Sequelize.STRING,
        required:true,
        allowNull:false
    }
})

DiasSemana.sync();

module.exports = DiasSemana;