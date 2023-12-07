const Sequelize = require('sequelize');
const db = require('./db');
const sequelize = require('./db');
const DiasSemana = require('./DiasSemana');

const Horario = db.define('horarios',{
    ID:{
        type: Sequelize.DataTypes.INTEGER,
        required:true,
        primaryKey:true,
        autoIncrement: true,
        allowNull:false
    },
    HORA_LIVRE:{
        type:Sequelize.TIME,
        required:true,
        allowNull:false
    }
});

Horario.belongsTo(DiasSemana,{
    constraint:true,
    foreignKey: 'idDiasSemanas'
})

Horario.sync();

module.exports = Horario;