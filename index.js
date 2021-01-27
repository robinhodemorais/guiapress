const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

//Controller
const CategoriesController = require("./categories/CategoriesController");
const ArticlesController = require("./articles/ArticlesController");

//Models
const Article = require("./articles/Aticle");
const Category = require("./categories/Category");

//View engine
app.set('view engine', 'ejs');

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

app.get("/", (req, res) => {
    //renderiza a view view\index.ejs
    res.render("index");
});

app.listen(8080,() => {
    console.log("O servidor está rodando na porta 8080");
});