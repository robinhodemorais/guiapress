const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

router.get("/admin/categories/new", (req, res) => {
    //caminho da view
    res.render("admin/categories/new");
});

router.post("/categories/save",(req,res) => {
    var title = req.body.title;
    if (title != undefined) {
        //Category -> model importado acima
        //slugify framework para otimizar a string
        //substituir o espaço por -
        Category.create({
            title:title,
            slug:slugify(title)
        }).then(()=> {
            res.redirect("/admin/categories");
        });
    } else {
        //se digitar um valor invalido redireciona para o formulario        
        res.redirect("admin/categories/new");
    }
});

router.get("/admin/categories",(req, res) => {
    Category.findAll().then(categories => {
        //caminho da view
        //passa  a variavel categories para utilizar na view
        res.render("admin/categories/index",{categories:categories});
    });
});

router.post("/categories/delete",(req,res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
           Category.destroy({
               where: {
                   id:id
               }
           }).then(() =>{
            res.redirect("/admin/categories");
           });
        } else {//se não for numero
            res.redirect("/admin/categories");
        }
    } else {//null
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/edit/:id",(req,res) => {
    var id = req.params.id;

    if (isNaN(id)) {
       res.redirect("/admin/categories");
    }

    Category.findByPk(id).then(category => {
        if (category != undefined) {
            res.render("admin/categories/edit", {category:category});
        } else {
            res.redirect("/admin/categories");
        } 
    }).catch(erro => {
        res.redirect("/admin/categories");
    });

});

module.exports = router;