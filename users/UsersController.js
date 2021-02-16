const express = require("express");
const router = express.Router();
const User = require("./Users");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
  User.findAll().then(users => {
    res.render("admin/users/index",{users: users});
  });
});

router.get("/admin/users/create",(req,res) => {
    res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({where:{email: email}}).then(user => {
    //se não achou o email no banco, pode cadastrar
    //assim não duplica
    if (user == undefined) {

      //para dar um salto
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);

      User.create({
        email:email,
        password:hash
      }).then(() => {
        res.redirect("/");
      }).catch((erro) => {
        res.redirect("/");
      });

      //res.json({email,password});

    } else {
      res.redirect("/admin/users/create");
    }
  });

});

router.get("/login",(req,res) => {
  res.render("admin/users/login");
});

router.post("/authenticate",(req,res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({where:{email:email}}).then(user => {
    if (user != undefined) {//se existe um usuário com este email
      //validar a senha
      var correct = bcrypt.compareSync(password,user.password);

      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email
        }
        res.redirect("/admin/articles");
        //res.json(req.session.user);
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  })

});

router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

module.exports = router;