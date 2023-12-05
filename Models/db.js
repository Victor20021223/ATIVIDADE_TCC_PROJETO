const Sequelize = require('sequelize');

const sequelize = new Sequelize("sistema", "root", "Sistema123", {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamp: false
    }
});

sequelize.authenticate().then(function(){
    console.log("Conexão com banco de dados bem sucedida")
}).catch(function(){
    console.log("Erro: conexão com o banco de dados")
});



module.exports = sequelize;