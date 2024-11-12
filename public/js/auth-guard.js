// função que verifica se existe um usuario logado
firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "login-cadastro.html";
    }
})