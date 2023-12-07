const Sequelize = require('sequelize');
const db = require('./db');
const sequelize = require('./db');

const Horario = db.define('horarios',{
    ID:{
        type: Sequelize.DataTypes.INTEGER,
        required:true,
        primaryKey:true,
        autoIncrement: true,
        allowNull:false
    },
    DIAS_DA_SEMANA:{
        type:Sequelize.STRING,
        required:true,
        allowNull:false
    },
    HORA_INICIO_EXPEDIENTE:{
        type:Sequelize.TIME,
        required:true,
        allowNull:false
    },
    HORA_FIM_EXPEDIENTE:{
        type:Sequelize.TIME,
        required:true,
        allowNull:false
    },
    INTERVALO_INICIO:{
        type:Sequelize.TIME,
        required:true,
        allowNull:false
    },
    INTERVALO_FIM:{
        type:Sequelize.TIME,
        required:true,
        allowNull:false
    },
    INTERVALO_ENTRE_ATEND:{
        type:Sequelize.TIME,
        required:true,
        allowNull:false
    }
});

Horario.sync();

module.exports = Horario;