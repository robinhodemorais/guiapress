function adminAuth(req, res, next) {
    //middlewares fica sempre entre a requisição e resposta
    //o next serve para passar a requisação do middlware na requisição
    if (req.session.user != undefined) {
        //aqui o usuário está logado
        next();
    } else {
        //se não estiver logado voltar para homepage
        res.redirect("/login");
    }

}

module.exports = adminAuth;