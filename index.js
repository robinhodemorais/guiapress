const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

//Controller
const CategoriesController = require("./categories/CategoriesController");
const ArticlesController = require("./articles/ArticlesController");
const UsersController = require("./users/UsersController");


//Models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/Users");

//View engine
app.set('view engine', 'ejs');

//Sessions
app.use(session({
  secret: "flex",
  cookie: {
    maxAge: 3000000
  }
}));

//Configuração para o express trabalhar com os arquivos staticos
//css, html, js e etc
app.use(express.static("public"));

//Body Parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//DataBase
connection
  .authenticate()
  .then(() => {
      console.log("Conexão feita com sucesso");
  }).catch((error) => {
    console.log(error);
  });

//coloca em uso as rotas
app.use("/",CategoriesController);
app.use("/",ArticlesController);
app.use("/",UsersController);


app.get("/", (req, res) => {
    Article.findAll({
      order:[
        ['id','DESC']
      ]
      , limit:4
    }).then(articles => {

      Category.findAll().then(categories => {
        //renderiza a view view\index.ejs
        res.render("index",{articles:articles, categories:categories});
      });

    });
});

app.get("/:slug",(req,res) => {
  var slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if (article != undefined ) {
      Category.findAll().then(categories => {
        //renderiza a view view\index.ejs
        res.render("article",{article:article, categories:categories});
      });

    } else {
      res.redirect("/");
    }
  }).catch(err => {
    res.redirect("/");
  });
});

app.get("/category/:slug",(req,res) => {
  var slug = req.params.slug;
  Category.findOne({
    where: {
      slug:slug
    },
    include:[{model:Article}]
  }).then(category => {
    if (category != undefined ) {
      Category.findAll().then(categories => {
        res.render("index",{articles:category.articles, categories:categories});
      });
    } else {
      res.redirect("/");
    }
  }).catch( err => {
    res.redirect("/");
  });
});

app.listen(3000,() => {
    console.log("O servidor está rodando na porta 3000");
});