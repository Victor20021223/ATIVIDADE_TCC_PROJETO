const Sequelize = require('sequelize');
const sequelize = require('./db'); // Importe sua instância do Sequelize

const CancelamentoEvento = sequelize.define('cancelamento_evento', {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  MOTIVO: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  idUser: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  idEvento: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'cancelamento_evento',
});

// Sincronize o modelo com o banco de dados
sequelize.sync();

module.exports = CancelamentoEvento;
