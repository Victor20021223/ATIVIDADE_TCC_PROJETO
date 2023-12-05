
const empresa = db.define('empresa',{
    id:{
        type: Sequelize.INTEGER,
        allowNull:false,
        unique:true,
        primaryKey:true
    },
    nome:{
        type: Sequelize.Sequelize.STRING,
        allowNull:false,
    },
    CNPJ:{
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
    },
    email:{
        type: Sequelize.STRING,
        allowNull:true
    },
    senha:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            is: /^[0-9a-f]{64}$/i
        }
    },
    imagen:{
        type: Sequelize.imagen,
        allowNull:true
    }
});

empresa.sync();