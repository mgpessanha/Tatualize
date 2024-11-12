// pega a url da img do corpo no armazenamento local
const urlImagemCorpo = localStorage.getItem('urlCorpo');

// exibe a img do corpo
if (urlImagemCorpo) {
    const imgResultadoCorpo = document.getElementById('resultado-corpo');
    imgResultadoCorpo.src = urlImagemCorpo;
}

// funçao para habilitar os botoes conforme a condiçao dada
document.getElementById('uploadTatuagemNova').addEventListener('change', function() {
  const fileInput = document.getElementById('uploadTatuagemNova');
  const aumentarButton = document.getElementById('botao-aumentar');
  const diminuirButton = document.getElementById('botao-diminuir');
  const finalizarButton = document.getElementById('botao-finalizar');
  if (fileInput.files.length > 0) {
      // habilita os botoes se um arquivo for selecionado
      aumentarButton.disabled = false;
      diminuirButton.disabled = false;
      finalizarButton.disabled = false;
  } else {
      // mantem os botoes desabilitados
      aumentarButton.disabled = true;
      diminuirButton.disabled = true;
      finalizarButton.disabled = true; 
  }
});

// funçao que faz o upload da tatuagem
document.getElementById('uploadTatuagemNova').addEventListener('change', function() {
  const fileInput = this.files[0];

  // acessa a galeria para resgatar a img salva
  if (fileInput) {
      const reader = new FileReader();

      reader.onload = function(e) {

          const imgResultadoTatuagemNova = document.getElementById('resultado-tatuagem-nova');
          imgResultadoTatuagemNova.src = e.target.result;
          imgResultadoTatuagemNova.style.display = 'block';
          
          // muda o estilo do container para se adaptar a img carregada
          document.getElementById('container').style.backgroundColor.display = 'none';
          document.getElementById('texto-container').style.display = 'none';

          const imgPreviewNova = document.getElementById('imagePreviewNova');
          imgPreviewNova.style.display = 'none';
      }

      reader.readAsDataURL(fileInput);
  }
});

// funçao que é executada quando todos os elementos carregarem completamente
window.onload = function() {
    const baseImage = document.getElementById('resultado-corpo');
    const overlayImage = document.getElementById('resultado-tatuagem-nova');
    let isDragging = false;
    let offsetX, offsetY;

    // funçao que verifica se as imagens estao carregadas antes de habilitar o download
    baseImage.onload = overlayImage.onload = function() {
      const botaoDownload = document.getElementById('botao-baixar');
      botaoDownload.style.display = 'block';
    };
    
    // funçao para arrastar a img com o mouse
    overlayImage.addEventListener('mousedown', function(event) {
      isDragging = true;
      offsetX = event.clientX - overlayImage.offsetLeft;
      offsetY = event.clientY - overlayImage.offsetTop;
    });
      
    // funçao que faz o mouse mover a img da tatuagem e armazena a posição final da img, atraves do click 
    document.addEventListener('mousemove', function(event) {
      if (isDragging) {
          
          const newX = event.clientX - offsetX;
          const newY = event.clientY - offsetY;

          overlayImage.style.left = newX + 'px';
          overlayImage.style.top = newY + 'px';
  
          finalX = newX;
          finalY = newY;

          moverDiv();
      }
    });
    
    // funçao que faz a img permanecer onde foi colocada, verificando o click
    document.addEventListener('mouseup', function() {
      isDragging = false;
    });

    // funçao que tira o comportamento do navegador de abrir a galeria ao clicar na imagem
    overlayImage.addEventListener('click', function(event) {
    event.preventDefault();
    });
};

// funçao que aumenta o tamanho da img
function aumentarTamanhoImagem() {
  const overlayImage = document.getElementById('resultado-tatuagem-nova');
  const currentWidth = overlayImage.offsetWidth;
  const currentHeight = overlayImage.offsetHeight;
  const newWidth = currentWidth * 1.1;
  const newHeight = currentHeight * 1.1;
  overlayImage.style.width = newWidth + 'px';
  overlayImage.style.height = newHeight + 'px';
}

// funçao que diminui o tamanho da img
function diminuirTamanhoImagem() {
  const overlayImage = document.getElementById('resultado-tatuagem-nova');
  const currentWidth = overlayImage.offsetWidth;
  const currentHeight = overlayImage.offsetHeight;
  const newWidth = currentWidth * 0.9;
  const newHeight = currentHeight * 0.9;
  overlayImage.style.width = newWidth + 'px';
  overlayImage.style.height = newHeight + 'px';
}

// funçao que coloca as duas imagens na mesma div
function moverDiv() {
  let div1 = document.getElementById('resultado-corpo');
  let div2 = document.getElementById('resultado-tatuagem-nova');
  let div3 = document.getElementById('canvasWhiteboard');

  div3.appendChild(div2);
  div3.appendChild(div1);
}

// funçao que realiza a montagem das imagens
function criarMontagem(){
  // pega a div ja com as imagens nela
  let divParaSalvar = document.getElementById('canvasWhiteboard');
  const imagemCorpo = document.getElementById('resultado-corpo');

  // realiza o scroll da pagina ate a img do corpo
  imagemCorpo.scrollIntoView({ behavior: 'smooth', block: 'start' });

  setTimeout(function() {
    // usa o html2canvas para transformar a div em uma img
    html2canvas(divParaSalvar).then(function(canvas) {
        // cria um elemento de img
        const imgMontagem = new Image();
        imgMontagem.src = canvas.toDataURL();

        // salva a img no armazenamento local
        localStorage.setItem('imgMontagem', imgMontagem.src);

        // redireciona para outra pagina, carregando essa montagem
        window.location.href = 'resultado-final.html';
    });
  }, 2000); // 2 segundos    
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
