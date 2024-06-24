const Sequelize = require('sequelize');
const sequelize = require('./db'); // Importe corretamente sua instância do Sequelize
const User = require('./User');
const Horario = require('./Horario');

const Evento = sequelize.define('Evento', {
    idUser: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users', 
            key: 'ID'       
        }
    },
    service: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    professional: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    horario: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'horarios',
            key: 'ID'
        }
    },
    start: {
        type: Sequelize.DATE
    },
    end: {
        type: Sequelize.DATE
    },
    situacao: {
        type: Sequelize.CHAR,
        allowNull: false,
        defaultValue: 'A'
    }
});

// Defina a associação
Evento.belongsTo(User, { foreignKey: 'idUser', as: 'usuario' });
Evento.belongsTo(Horario, { foreignKey: 'horario', as: 'horarios' });

sequelize.sync();

module.exports = Evento;
