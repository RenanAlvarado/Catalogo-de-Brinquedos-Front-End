/* ===================================== */
/* CARROSSEL DE MARCAS */
/* ===================================== */

const carousel = document.getElementById("brands-carousel");
const wrapper = document.getElementById("brands-wrapper");

let items = document.querySelectorAll(".brand");
const itemWidth = items[0].offsetWidth + 20;

// ===== DUPLICAR LISTA =====
carousel.innerHTML += carousel.innerHTML;
items = document.querySelectorAll(".brand");

let position = 0;
let speed = 0; // começa parado
const totalWidth = (items.length / 2) * itemWidth;

// ===== ANIMAÇÃO CONTÍNUA =====
function animate() {
  position -= speed;
  const visiblePosition = position % totalWidth;
  carousel.style.transform = `translateX(${visiblePosition}px)`;
  requestAnimationFrame(animate);
}
animate();

// ===== CONTROLE PELO MOUSE =====
wrapper.addEventListener("mousemove", (e) => {
  const rect = wrapper.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const center = rect.width / 2;

  if (x < center - 50) {
    speed = -3.5;
  } else if (x > center + 50) {
    speed = 3.5;
  } else {
    speed = 1;
  }
});

// ===== VOLTA AO NORMAL =====
wrapper.addEventListener("mouseleave", () => {
  speed = 1;
});

/* ===================================== */
/* CARROSSEL DO BANNER */
/* ===================================== */

const bannerCarousel = document.querySelector("#banner-carousel");
const bannerSlides = document.querySelectorAll(".banner-slide");

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let bannerIndex = 0;

// atualizar posição
function updateBanner() {
  bannerCarousel.style.transform = `translateX(-${bannerIndex * 100}%)`;
}

// botão próximo
nextBtn.addEventListener("click", () => {
  bannerIndex++;

  if (bannerIndex >= bannerSlides.length) {
    bannerIndex = 0;
  }

  updateBanner();
});

// botão anterior
prevBtn.addEventListener("click", () => {
  bannerIndex--;

  if (bannerIndex < 0) {
    bannerIndex = bannerSlides.length - 1;
  }

  updateBanner();
});

// auto slide
setInterval(() => {
  bannerIndex++;

  if (bannerIndex >= bannerSlides.length) {
    bannerIndex = 0;
  }

  updateBanner();
}, 5000);

// Consumo de API para listar todos os brinquedos

// Seleciona elemento pai
const productsContainer = document.querySelector("#products-wrapper");

// Cria função assíncrona(necessita da espera) para receber os brinquedos
async function carregarBrinquedos() {
  // Requisição da API --> await para esperar a resposta antes de continuar
  const resposta = await fetch("http://localhost:8080/api/brinquedos");

  //Converte a resposta em JSON
  const brinquedos = await resposta.json();

  // Criação do botão e cada uma das partes
  brinquedos.forEach((brinquedo) => {
    const card = document.createElement("button");
    card.classList.add("product-card");

    // verifica se existe imagem, se não é placeholder
    const imagem = brinquedo.imagem ? brinquedo.imagem : "img/placeholder.png";

    // Código html que recebe as variáveis
    card.innerHTML = `
      <img 
        src="img/toys/${imagem}" 
        alt="${brinquedo.nome}" 
        class="toy-img"
        onerror="this.src='img/placeholder.png'"
      />
      <h3 class="toy-title">${brinquedo.nome}</h3>
      <p class="toy-description">${brinquedo.descricao}</p>
    `;

    // Inserção do card no elemento pai
    productsContainer.appendChild(card);
  });
}

// Chamar função para quando a página carregar
carregarBrinquedos();

// API para carregar categorias
const categoryContainer = document.querySelector("#categories-wrapper");

// Cria função assíncrona(necessita da espera) para receber os brinquedos
async function carregarCategorias() {
  // Requisição da API --> await para esperar a resposta antes de continuar
  const resposta = await fetch("http://localhost:8080/api/categorias");

  //Converte a resposta em JSON
  const categorias = await resposta.json();

  // Criação do botão e cada uma das partes
  categorias.forEach((categoria) => {
    const card = document.createElement("button");
    card.classList.add("category-card");

    // verifica se existe imagem, se não é placeholder
    const imagem = categoria.imagem ? categoria.imagem : "img/placeholder.png";

    // Código html que recebe as variáveis
    card.innerHTML = `
      <img 
        src="img/categories/${imagem}" 
        alt="${categoria.nome}" 
        class="category-img"
        onerror="this.src='img/placeholder.png'"
      />
      <h3 class="category-title">${categoria.nome}</h3>  
    `;

    // Inserção do card no elemento pai
    categoryContainer.appendChild(card);
  });
}

// Chamar função para quando a página carregar
carregarCategorias();
