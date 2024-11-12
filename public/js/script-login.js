
// função para exibir as animações de tinta quando a pagina for carregada
document.addEventListener("DOMContentLoaded", function() {
    const inkDrop = document.querySelector('.ink-drop');
    const splash = document.getElementById('splash');
    const mainContent = document.getElementById('main-content');

    // função que espera a animaçao de gota acabar para iniciar a do splash
    inkDrop.addEventListener('animationend', function() {
        inkDrop.style.display = 'none';
        splash.style.display = 'block';
        splash.style.animation = 'splashEffect 3s forwards';
    });

    // função para animaçao do splash
    splash.addEventListener('animationstart', function() {
        // exibe o conteudo da pagina assim que o splash terminar
        setTimeout(function() {
            mainContent.style.display = 'block';
        }, 3000);
    });

    // função para esconder o splash quando ele terminar
    splash.addEventListener('animationend', function() {
        splash.style.display = 'none';
    });
});

// obj facilitador para pegar as IDs dos elementos
const form = {
    email: () => document.getElementById('email'),
    emailInvalidError: () => document.getElementById('email-invalido-error'),
    emailRequiredError: () => document.getElementById('email-obrigatorio-error'),
    loginButton: () => document.getElementById('entrar-botao'),
    password: () => document.getElementById('password'),
    passwordRequiredError: () => document.getElementById('senha-obrigatoria-error'),
    recoverPassword: () => document.getElementById('recuperar-botao'),
}

const container = document.getElementById('container');
const overlayCon = document.getElementById('overlayCon');
const overlayBtn = document.getElementById('overlayBtn');
const googleLoginBtn = document.getElementById('google-login');

// verifica se o usuario esta logado ou nao
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        window.location.href = "index.html";
    }
});

// função para trocar as telas de login de cadastro
overlayBtn.addEventListener('click', () => {
    container.classList.toggle('right-panel-active');

    overlayBtn.classList.remove('btnScaled');
    window.requestAnimationFrame( () => {
        overlayBtn.classList.add('btnScaled');
    })
});

// função que verifica o campo de email
function onChangeEmail() {
    alternarEmailErrors();
    alternarBotoesDesabilitados();
}

// função que verifica o campo de senha
function onChangePassword() {
    alternarBotoesDesabilitados();
    alternarSenhaErrors();
}

// função que realiza o login e cadastro do usuario pelo google
googleLoginBtn.addEventListener('click', function() {
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            const user = result.user;

            // verifica se o usuário é novo
            if (result.additionalUserInfo.isNewUser) {
                // adiciona o usuário no banco de dados
                firebase.database().ref('usuarios/' + user.uid).set({
                    email: user.email,
                    creditos: 5
                }).then(() => {
                    console.log("Novo usuário cadastrado: ", user);
                    window.location.href = "index.html"; // redireciona após o cadastro bem-sucedido
                }).catch(error => {
                    console.log(error);
                    alert("Erro ao salvar dados do usuário no banco de dados: " + error.message);
                });
            } else {
                window.location.href = "index.html"; // redireciona após o login bem-sucedido
            }
        })
        .catch((error) => {
            console.error("Erro durante o login com o Google: ", error);
            alert("Erro durante o login com o Google: " + error.message);
        });
});

// função que realiza o login do usuario
function login() {
    firebase.auth().signInWithEmailAndPassword(
        form.email().value, form.password().value
    ).then(response => {
        window.location.href = "index.html";
    }).catch(error => {
        alert(getErrorMessage(error));
    });
}

// função que traduz para o usuario o erro no login
function getErrorMessage(error) {
    if (error.code == "auth/invalid-credential") {
        return "Usuário e/ou senha inválidos. Tente novamente.";
    }
    return error.message;
}

// função que envia o email para recuperação de senha
function recoverPassword() {
    firebase.auth().sendPasswordResetEmail(form.email().value).then(() => {
        alert('Email enviado! Caso não chegue ao destino, verifique se informou corretamente.');       
    }).catch(error => {
        alert(getErrorMessage(error));
    });
}

// função para verificar se o email é valido
function isEmailValid() {
    const email = form.email().value;
    if (!email) {
        return false;
    }
    return validarEmail(email);
}

// função para verificar se a senha é valida
function isPasswordValid() {
    const password = form.password().value;
    if (!password) {
        return false;
    }
    return true;
}


document.getElementById('email').addEventListener('input', function() {
    alternarEmailErrors();
    alternarBotoesDesabilitados();
});


document.getElementById('password').addEventListener('input', function() {
    alternarSenhaErrors();
    alternarBotoesDesabilitados();
});

// função para alternar os erros de email e ajustar o estado do botão
function alternarEmailErrors() {
    const email = form.email().value;
    const emailValid = validarEmail(email);
    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display = emailValid ? "none" : "block";
    alternarBotoesDesabilitados();
}

// função para alternar os erros de senha e ajustar o estado do botão
function alternarSenhaErrors() {
    const password = form.password().value;
    const passwordValid = password.length >= 6; 
    form.passwordRequiredError().style.display = password ? "none" : "block";
    form.passwordSizeError().style.display = passwordValid ? "none" : "block";
    alternarBotoesDesabilitados();
}

// função para ativar ou desativar o botão com base na validade dos campos
function alternarBotoesDesabilitados() {
    const emailValid = validarEmail(form.email().value);
    const passwordValid = form.password().value.length >= 6; 
    form.loginButton().disabled = !(emailValid && passwordValid);
    form.recoverPassword().disabled = !emailValid;
}
