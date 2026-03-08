// API para carregar categorias
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
