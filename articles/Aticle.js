const Sequelize = require("sequelize");
const connection = require("../database/database");
//importa o model que quer relacionar
const Category = require("../categories/Category");

const Article = connection.define('articles',{
    title:{
        type:Sequelize.STRING,
        allowNull:false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull:false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull:false
    }
});

//relaciona a categoria com o artigo
// 1 -> N
//hasMany -> UMA categoria tem muitos artigos
Category.hasMany(Article);

//relaciona o artigo com a categoria
// 1 -> 1
//belongsTo -> UM artigo percente a uma categoria
Article.belongsTo(Category);

//força a sincronização, sempre que a aplicação recarregar ele vai criar a tabela
//então quando necessita atualizar algo da tabela força, reinica a aplicação e desabilita
//Article.sync({force: true});

module.exports = Article;