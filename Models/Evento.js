const Sequelize = require('sequelize');
const db = require('./db');
const sequelize = require('./db');

const Evento = sequelize.define('Evento', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    start: {
      type: Sequelize.DATE,
      allowNull: false
    },
    end: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });
  
  // Sincronize o modelo com o banco de dados
  sequelize.sync();
  
  module.exports = Evento;