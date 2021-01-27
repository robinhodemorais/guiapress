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
            res.redirect("/");
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

module.exports = router;