// funçao para habilitar o botao conforme a condiçao dada
document.getElementById('uploadCorpo').addEventListener('change', function() {
    const fileInput = document.getElementById('uploadCorpo');
    const exibirImgButton = document.getElementById('exibirButton');
    if (fileInput.files.length > 0) {
        // habilita o botao se um arquivo for selecionado
        exibirImgButton.disabled = false;
    } else {
        // mantem o botao desabilitado
        exibirImgButton.disabled = true; 
    }
});

// funçao para exibir a img do corpo na pagina
function exibirFoto(){
    const loadingAnimation = document.getElementById('loading-animation');
    loadingAnimation.style.display = 'block';

    setTimeout(function() {
        loadingAnimation.style.display = 'none'; 
        
        const fileInput = document.getElementById('uploadCorpo').files[0];

        if (fileInput) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const imgResultadoCorpo = document.getElementById('resultado-corpo');
                imgResultadoCorpo.src = e.target.result;
                imgResultadoCorpo.style.display = 'block';

                document.getElementById('titulo-escondido').style.color = '#000000';
                document.getElementById('continuarButton').style.display = 'block';
                document.getElementById('aviso-continuar').style.color = '#7d4497';
                document.getElementById('aviso-continuar').style.textDecoration = 'underline';
            }

            document.getElementById('titulo-escondido').classList.remove('color-initial');
            
            reader.readAsDataURL(fileInput);
        }
    // 3 segundos de loading
    }, 3000); 
};

// funçao para redirecionar a pagina para outra, carregando a img do corpo pra ela
function continuar(){
    const urlCorpo = document.getElementById('resultado-corpo').src;
    localStorage.setItem('urlCorpo', urlCorpo);
        
    window.location.href = 'editar.html';
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


