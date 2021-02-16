const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles",adminAuth, (req, res) => {
    Article.findAll({
        //inclui o model Category e já relaciona pelo
        //relacionamento feito
        include:[{model:Category}]
    }).then(articles => {
        res.render("admin/articles",{articles:articles});
    });
    
});

router.get("/admin/articles/new",adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories:categories});
    });
    
});

router.post("/articles/save",adminAuth,(req,res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title:title,
        slug:slugify(title),
        body:body,
        categoryId:category
    }).then(() => {
        res.redirect("/admin/articles");
    })
});

router.post("/articles/delete",adminAuth,(req,res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
               where: {
                   id:id
               }
           }).then(() =>{
            res.redirect("/admin/articles");
           });
        } else {//se não for numero
            res.redirect("/admin/articles");
        }
    } else {//null
        res.redirect("/admin/articles");
    }
});


router.get("/admin/articles/edit/:id",(req,res) => {
    var id = req.params.id;

    if (isNaN(id)) {
       res.redirect("/admin/articles");
    }

    Article.findByPk(id).then(article => {
        if (article != undefined) {   
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {article:article, categories:categories});
            });         
        } else {
            res.redirect("/admin/articles");
        } 
    }).catch(erro => {
        res.redirect("/admin/articles");
    });

});

router.post("/articles/update",(req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({
            title:title,
            slug:slugify(title),
            body:body,
            categoryId:category
        },{
        where: { id:id }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(erro => {
        res.redirect("/admin/articles");
    });
});

router.get("/articles/page/:num",(req, res) => {
    var page = req.params.num;
    var limitPage = 3;
    var offset = 0;
    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page)-1) * limitPage;
    }
    
    //pesquisa todos os elementos da tabela e retorna a quantidade de linhas
    Article.findAndCountAll({
        //limite de dados que vai mostrar
        limit: limitPage,
        //para exibir apartir de x artigo
        offset: offset,
        order:[
            ['id','DESC']
          ]    
    }).then(articles => {
        //para verificar se irá existir outra pagina
        var next;
        if(offset + limitPage >= articles.count) {
            next = false;
        } else {
            next = true;
        }
        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page",{result:result,categories:categories});    
        })
        
    });
});

module.exports = router;