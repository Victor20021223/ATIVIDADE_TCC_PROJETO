const Sequelize = require('sequelize');
const db = require('./db');
const sequelize = require('./db');

const Evento = sequelize.define('Evento', {
    title: {
      type: Sequelize.STRING,
      allowNull: true
    },
    service: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    professional: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    horario:{
      type: Sequelize.INTEGER,
      allowNull:true
    },
    start:{
      type:Sequelize.DATE
    },
    end:{
      type:Sequelize.DATE
    }
  });
  
  // Sincronize o modelo com o banco de dados
  sequelize.sync();
  
  module.exports = Evento;