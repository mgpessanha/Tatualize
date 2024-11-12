// pega a img da montagem no armazenamento local
const urlImagemMontagem = localStorage.getItem('imgMontagem');

// exibe a img da montagem
if (urlImagemMontagem) {
    const imgMontagem = document.getElementById('imagem-montagem');
    imgMontagem.src = urlImagemMontagem;
} 

// funçao que faz o download da montagem
function downloadMontagem() {
    // pega a URL da img da montagem no armazenamento local
    const urlImagemMontagem = localStorage.getItem('imgMontagem');

    // verifica se a URL da img da montagem esta ali
    if (urlImagemMontagem) {
        // cria um link com a URL da img
        let anchorElement = document.createElement('a');
        anchorElement.href = urlImagemMontagem;
        anchorElement.download = 'montagem.png';
        document.body.appendChild(anchorElement);

        anchorElement.click();

        document.body.removeChild(anchorElement);
    } else {
        // exibe uma msg de erro se a URL da img nao estiver ali
        console.error('Erro: URL da imagem da montagem não encontrada.');
    }
}

// função para recuperar e exibir créditos
function mostrarCreditos() {
    const creditos = localStorage.getItem('creditos');
    if (creditos !== null) {
        document.getElementById('creditos').textContent = creditos;
    } else {
        console.log('Nenhum crédito encontrado no localStorage');
    }
}

// chama a função quando o conteúdo da página estiver carregado
document.addEventListener('DOMContentLoaded', (event) => {
    mostrarCreditos();
});