const Sequelize = require('sequelize');
const db = require('./db');
const sequelize = require('./db');

const EventoSemanal = sequelize.define('evento_semanal', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    start_time: {
        type: Sequelize.TIME,
        allowNull: false,
    },
    end_time: {
        type: Sequelize.TIME,
        allowNull: false,
    },
    day_of_week: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

EventoSemanal.sync();

module.exports = EventoSemanal;