const Sequelize = require("sequelize");
const connection = require("../database/database");

const Category = connection.define('categories',{
    title:{
        type:Sequelize.STRING,
        allowNull:false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull:false
    }
});

//força a sincronização, sempre que a aplicação recarregar ele vai criar a tabela
//então quando necessita atualizar algo da tabela força, reinica a aplicação e desabilita
//Category.sync({force: true});

module.exports = Category;