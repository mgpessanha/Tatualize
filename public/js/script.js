// função que faz o logout do usuario
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "login-cadastro.html";
    }).catch(() => {
        alert("Erro ao fazer logout");
    });
}

// verifica se o usuário está logado ou não
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // exibe o email do usuario se ele estiver logado
        document.getElementById('email-logado').textContent = user.email;
        
        // exibe os creditos do usuario diretamente do database
        const userId = user.uid;
        firebase.database().ref('usuarios/' + userId).once('value').then(snapshot => {
            const creditos = snapshot.val().creditos;
            document.getElementById('creditos').textContent = creditos;

             // salva os créditos no localStorage
             localStorage.setItem('creditos', creditos);
        }).catch(error => {
            console.log('Erro ao ler créditos:', error);
        });
    } else {
        window.location.href = "login-cadastro.html";
    }
});

