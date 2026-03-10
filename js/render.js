// ===============================
// FUNÇÃO AUXILIAR PARA IMAGENS -->  Arquivo que Carrega os elementos
// ===============================

function obterImagem(pasta, imagem) {
  return imagem ? `img/${pasta}/${imagem}` : "img/placeholder.png";
}

// ===============================
// RENDERIZAR CATEGORIAS
// ===============================

export function renderizarCategorias(container, categorias) {
  container.innerHTML = "";

  categorias.forEach((categoria) => {
    const card = document.createElement("button");
    card.classList.add("category-card");

    const imagem = obterImagem("categories", categoria.imagem);

    card.innerHTML = `
      <img 
        src="${imagem}" 
        alt="${categoria.nome}" 
        class="category-img"
        onerror="this.src='img/placeholder.png'"
      />
      <h3 class="category-title">${categoria.nome}</h3>
    `;

    container.appendChild(card);
  });
}

// ===============================
// RENDERIZAR BRINQUEDOS
// ===============================

export function renderizarBrinquedos(container, brinquedos) {
  container.innerHTML = "";

  brinquedos.forEach((brinquedo) => {
    const card = document.createElement("button");
    card.classList.add("product-card");

    const imagem = obterImagem("toys", brinquedo.imagem);

    card.innerHTML = `
      <img 
        src="${imagem}" 
        alt="${brinquedo.nome}" 
        class="toy-img"
        onerror="this.src='img/placeholder.png'"
      />
      <h3 class="toy-title">${brinquedo.nome}</h3>
      <p class="toy-description">${brinquedo.descricao}</p>
    `;

    container.appendChild(card);
  });
}
