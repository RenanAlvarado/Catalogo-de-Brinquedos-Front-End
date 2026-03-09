// Consumo de APIs

//Categorias
const categoryCarousel = document.querySelector("#categories-carousel");

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
    categoryCarousel.appendChild(card);
  });
}

// Chamar função para quando a página carregar
carregarCategorias();

//Brinquedos

// Função que coloca no card
function renderizarBrinquedos(brinquedos) {
  productsContainer.innerHTML = "";

  brinquedos.forEach((brinquedo) => {
    const card = document.createElement("button");
    card.classList.add("product-card");

    const imagem = brinquedo.imagem ? brinquedo.imagem : "img/placeholder.png";

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
    productsContainer.appendChild(card);
  });
}

// Seleciona elemento pai
const productsContainer = document.querySelector("#products-wrapper");

// Cria função assíncrona(necessita da espera) para receber os brinquedos(geral)
async function carregarBrinquedos() {
  const resposta = await fetch("http://localhost:8080/api/brinquedos");

  const brinquedos = await resposta.json();

  renderizarBrinquedos(brinquedos);
}

carregarBrinquedos();

// Função de Pesquisa

// Carregar as sugestões da pesquisa
function mostrarSugestoes(brinquedos) {
  suggestionsBox.innerHTML = "";

  if (brinquedos.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  brinquedos.slice(0, 5).forEach((brinquedo) => {
    const item = document.createElement("div");
    item.classList.add("suggestion-item");

    item.textContent = brinquedo.nome;

    item.addEventListener("click", () => {
      searchInput.value = brinquedo.nome;
      suggestionsBox.style.display = "none";
    });

    suggestionsBox.appendChild(item);
  });

  suggestionsBox.style.display = "block";
}

// Tirar a função de submit do formulário
const formBusca = document.querySelector("#busca-navbar form");

formBusca.addEventListener("submit", (e) => {
  e.preventDefault();
});

// Carregar o input, cada tecla clicada
const searchInput = document.querySelector("#search-input");
const suggestionsBox = document.querySelector("#suggestions-box");

searchInput.addEventListener("input", async () => {
  const valor = searchInput.value.trim();

  if (valor.length < 1) {
    suggestionsBox.style.display = "none";
    return;
  }

  const resposta = await fetch(
    `http://localhost:8080/api/brinquedos/contem-nome/${valor}`,
  );

  const brinquedos = await resposta.json();

  mostrarSugestoes(brinquedos);
});

document.addEventListener("click", (e) => {
  if (!document.querySelector("#busca-navbar").contains(e.target)) {
    suggestionsBox.style.display = "none";
  }
});
