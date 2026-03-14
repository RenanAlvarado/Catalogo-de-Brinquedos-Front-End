// ===============================
// FUNÇÃO AUXILIAR PARA IMAGENS -->  Arquivo que Carrega os elementos
// ===============================

function obterImagem(pasta, imagem) {
  return imagem ? `img/${pasta}/${imagem}` : "img/placeholder.png";
}

// ===============================
// RENDERIZAR CATEGORIAS
// ===============================

export function renderizarCategorias(container, categorias, aoClicar) {
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

    // guardar id da categoria
    card.dataset.id = categoria.id;

    // evento de clique
    card.addEventListener("click", () => {
      // Se a função aoClicar existir, ela será executada passando os dados
      if (typeof aoClicar === "function") {
        aoClicar(categoria.id, categoria.nome);
      }
    });

    container.appendChild(card);
  });
}

// ===============================
// RENDERIZAR FILTROS DAS CATEGORIAS
// ===============================
export function renderizarFiltroCategorias(container, categorias) {
  container.innerHTML = "";

  categorias.forEach((categoria) => {
    const label = document.createElement("label");

    label.innerHTML = `
      <input type="checkbox" value="${categoria.id}">
      <span>${categoria.nome}</span>
    `;

    container.appendChild(label);
  });
}

// ===============================
// RENDERIZAR MARCAS
// ===============================

export function renderizarMarcas(container, marcas, aoClicar) {
  container.innerHTML = "";

  marcas.forEach((marca) => {
    const card = document.createElement("button");
    card.classList.add("brand-card");

    const imagem = obterImagem("brands", marca.imagem);

    card.innerHTML = `
      <img 
        src="${imagem}" 
        alt="${marca.nome}" 
        class="brand-img"
        onerror="this.src='img/placeholder.png'"
      />
    `;

    // guardar id da categoria
    card.dataset.id = marca.id;

    // evento de clique
    card.addEventListener("click", () => {
      // Se a função aoClicar existir, ela será executada passando os dados
      if (typeof aoClicar === "function") {
        aoClicar(marca.id, marca.nome);
      }
    });

    container.appendChild(card);
  });
}

// ===============================
// RENDERIZAR FILTROS DAS MARCAS
// ===============================
export function renderizarFiltroMarcas(container, marcas) {
  container.innerHTML = "";

  marcas.forEach((marca) => {
    const label = document.createElement("label");

    label.innerHTML = `
      <input type="checkbox" value="${marca.id}">
      <span>${marca.nome}</span>
    `;

    container.appendChild(label);
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
      <p class="toy-price">R$: ${brinquedo.preco}</p>
    `;

    container.appendChild(card);
  });
}
