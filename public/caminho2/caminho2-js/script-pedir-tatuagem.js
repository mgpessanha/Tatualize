// Função para obter as chaves de API do backend
const obterChavesAPI = async () => {
    try {
        const response = await fetch('https://us-central1-projeto-tatualize.cloudfunctions.net/api/api/keys');
        if (!response.ok) throw new Error("Failed to fetch API keys.");
        const { apiKeyO, apiKeyR } = await response.json();
        return { apiKeyO, apiKeyR };
    } catch (error) {
        console.error('Erro ao buscar chaves de API:', error);
        throw error;
    }
};

// função para recuperar e exibir créditos
function mostrarCreditos() {
    const creditos = parseInt(localStorage.getItem('creditos'), 10);
    console.log(creditos);
    if (!isNaN(creditos)) {
        document.getElementById('creditos').textContent = creditos;
        if (creditos <= 0) {
            botaoEnviar.disabled = true;
            inputDescricao.disabled = true;
            alert("Você não tem mais créditos disponíveis.");
        }
    } else {
        console.log('Nenhum crédito encontrado no localStorage');
    }
}

mostrarCreditos();

// Exemplo de uso no frontend
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { apiKeyO } = await obterChavesAPI();
        
        // API_KEY para OpenAI
        const API_KEY = apiKeyO;

        const sectionEscondida = document.querySelector(".section-escondida");
        const botaoContinuar = document.getElementById("continuarButton");

        const enviarForm = document.querySelector(".input-container");
        const container = document.querySelector(".container-imagem");
        const complemento = ". Estilo: ink e realista. Retorne essa imagem em formato PNG.";
        const inputDescricao = document.getElementById('descricao-tatuagem');
        const botaoEnviar = document.getElementById('botao-enviar-api');

        let isImageGenerating = false;

        // funçao para habilitar o botao somente quando o usuário digitar no input
        inputDescricao.addEventListener('input', function() {
            // verifica se tem texto no campo do input
            if (inputDescricao.value.trim() !== '') {      
                botaoEnviar.disabled = false;
            } else {
                botaoEnviar.disabled = true;
            }
        });

        // funçao para posicionar os dados retornados de cada img nos cards
        const mostrarCard = (dadosImagem) => {
            dadosImagem.forEach((objetoImg, index) => {
                const imgCard = container.querySelectorAll(".img-card")[index];
                const imgElement = imgCard.querySelector("img");
                const h2Element = imgCard.querySelector("h2");
                const avisoElement = sectionEscondida.querySelector("#titulo-escondido");
                const botaoDownload = imgCard.querySelector(".botao-download");
                const imagemGerada = `data:image/jpeg;base64,${objetoImg.b64_json}`;
                imgElement.src = imagemGerada;  

                // funçao para quando as imagens estiverem completamente carregadas na pagina
                imgElement.onload = () => {
                    imgCard.classList.remove("loading");
                    botaoDownload.setAttribute("href", imagemGerada);
                    // realizaçao do download das imagens geradas
                    botaoDownload.setAttribute("download", `${new Date().getTime()}.jpeg`);
                    avisoElement.style.display = 'block'; 
                    botaoContinuar.style.display = 'block'; 
                    h2Element.style.display = 'none';
                }  
            });
        }

        // funçao que envia a requisiçao para a api da openai
        const enviarRequisicao = async (inputForm, quantidadeForm) => {
            try {
                const response = await fetch("https://api.openai.com/v1/images/generations", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        prompt: "I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: " + inputForm,
                        n: parseInt(quantidadeForm),
                        size: "256x256",
                        response_format: "b64_json"
                    })
                });

                if(!response.ok) throw new Error("A geração de imagens falhou! Tente novamente.");

                const { data } = await response.json();
                // chama a funçao para adicionar o resultado das imagens geradas nos cards
                mostrarCard([...data]);

                // atualiza os créditos do usuário
                await atualizarCreditos(-quantidadeForm);

            } catch (error) {
                alert(error.message);
            } finally {
                isImageGenerating = false;
            }
        }

        // funçao que inicia o processo ate o envio da requisiçao a api
        const gerarImagem = (e) => {
            e.preventDefault();

            // não deixa outra requisição ser feita até que as imagens sejam carregadas
            if(isImageGenerating) return;
            isImageGenerating = true;

            // pega o input e a quantidade de imagens do form
            const inputForm = e.srcElement[0].value + complemento;
            const quantidadeForm = e.srcElement[1].value;

            // adiciona uma classe ao container de acordo com a quantidade de imagens selecionadas
            container.classList.remove("duas-imagens", "tres-imagens");
            if (quantidadeForm === "2") {
                container.classList.add("duas-imagens");
            } else if (quantidadeForm === "3") {
                container.classList.add("tres-imagens");
            }
        
            // exibe os cards de loading para cada img gerada
            const imgCardMarkup = Array.from({length: quantidadeForm}, () =>
                `<div class="img-card loading">
                    <img src="../assets/loader.svg" alt="">
                    <a href="#" class="botao-download">
                        <img src="../assets/download.svg">
                    </a>
                </div>`
            ).join("");

            container.innerHTML = imgCardMarkup;

            // chama a funçao para enviar a requisao para a api
            enviarRequisicao(inputForm, quantidadeForm);
        
        }

        // chama a funçao gerarImagem quando o botao for clicado
        enviarForm.addEventListener("submit", gerarImagem);


        // função que redireciona para outra pagina
        botaoContinuar.onclick = () => {
            window.location.href = 'remover-fundo-ia.html'; 
        }

        // função que atualiza os créditos do usuário
        const atualizarCreditos = async (mudanca) => {
            const user = firebase.auth().currentUser;
            if (user) {
                const userId = user.uid;
                const userRef = firebase.database().ref('usuarios/' + userId);

                const snapshot = await userRef.once('value');
                let creditosAtuais = snapshot.val().creditos;

                creditosAtuais += mudanca;

                await userRef.update({ creditos: creditosAtuais });
                localStorage.setItem('creditos', creditosAtuais);

                document.getElementById('creditos').textContent = creditosAtuais;

                if (creditosAtuais <= 0) {
                    botaoEnviar.disabled = true;
                    inputDescricao.disabled = true;
                    alert("Você não tem mais créditos disponíveis.");
                }
            }
        };

        /* função para recuperar e exibir créditos
        function mostrarCreditos() {
            const creditos = parseInt(localStorage.getItem('creditos'), 10);
            console.log(creditos);
            if (!isNaN(creditos)) {
                document.getElementById('creditos').textContent = creditos;
                if (creditos <= 0) {
                    botaoEnviar.disabled = true;
                    inputDescricao.disabled = true;
                    alert("Você não tem mais créditos disponíveis.");
                }
            } else {
                console.log('Nenhum crédito encontrado no localStorage');
            }
        }

        mostrarCreditos();*/
        
        
        } catch (error) {
            // Lidar com erros
            alert('Erro ao obter as chaves da API.');
        }
});





