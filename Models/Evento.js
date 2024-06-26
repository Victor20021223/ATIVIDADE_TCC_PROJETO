const Sequelize = require('sequelize');
const sequelize = require('./db'); // Importe corretamente sua instância do Sequelize
const User = require('./User');
const Horario = require('./Horario');
const Servicos = require('./Servicos');
const Profissional = require('./Profissional');

const Evento = sequelize.define('Evento', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        primaryKey: true,
    },
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
        references: {
            model: 'servico',
            key: 'ID'
        }
    },
    professional: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'horarios',
            key: 'id'
        }
    },
    horario: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'profissional',
            key: 'id'
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
Evento.belongsTo(Servicos, { foreignKey: 'service', as: 'servico' });
Evento.belongsTo(Profissional, { foreignKey: 'professional', as: 'profissional' });
Evento.belongsTo(Horario, { foreignKey: 'horario', as: 'horarios' });

sequelize.sync();

module.exports = Evento;
