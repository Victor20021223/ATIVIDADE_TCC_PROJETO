const Sequelize = require('sequelize');
const db = require('./db');
const sequelize = require('./db');
const Horario = require('./Horario');

const DiasSemana = de.define('dias_semanas',{
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