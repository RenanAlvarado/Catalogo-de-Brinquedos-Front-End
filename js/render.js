// ===============================
// FUNÇÃO AUXILIAR PARA IMAGENS -->  Arquivo que Carrega os elementos
// ===============================

function obterImagem(pasta, imagem) {
  return imagem ? `img/${pasta}/${imagem}` : "img/placeholder.png";
}

// ===============================
// FUNÇÃO AUXILIAR PARA CRIAR SELECTS
// ===============================
export function renderizarSelect(select, lista, placeholder) {
  if (!select) return;

  // opção padrão
  select.innerHTML = `<option value="">${placeholder}</option>`;

  lista.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.nome;

    select.appendChild(option);
  });
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
export function renderizarFiltroCategorias(container, categorias, aoAlterar) {
  container.innerHTML = "";

  categorias.forEach((categoria) => {
    const item = document.createElement("label");
    item.classList.add("filter-item");

    item.innerHTML = `
      <input 
        type="checkbox" 
        class="filter-checkbox"
        value="${categoria.id}"
      >
      <span class="checkmark"></span>
      <span class="filter-text">${categoria.nome}</span>
    `;

    const checkbox = item.querySelector("input");

    checkbox.addEventListener("change", () => {
      if (typeof aoAlterar === "function") {
        aoAlterar(categoria.id, checkbox.checked);
      }
    });

    container.appendChild(item);
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
export function renderizarFiltroMarcas(container, marcas, aoAlterar) {
  container.innerHTML = "";

  marcas.forEach((marca) => {
    const item = document.createElement("label");
    item.classList.add("filter-item");

    item.innerHTML = `
      <input 
        type="checkbox" 
        class="filter-checkbox"
        value="${marca.id}"
      >
      <span class="checkmark"></span>
      <span class="filter-text">${marca.nome}</span>
    `;

    const checkbox = item.querySelector("input");

    checkbox.addEventListener("change", () => {
      if (typeof aoAlterar === "function") {
        aoAlterar(marca.id, checkbox.checked);
      }
    });

    container.appendChild(item);
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

    // Abrir a tela de detalhes já com id ao clicar
    card.addEventListener("click", () => {
      window.location.href = `detalhes_brinquedo.html?id=${brinquedo.id}`;
    });

    container.appendChild(card);
  });
}

// ===============================
// RENDERIZAR PÁGINAÇÃO DE PRODUTOS
// ===============================

export function renderizarPaginacao(container, data, aoMudarPagina) {
  container.innerHTML = "";

  // ANTERIOR
  const prev = document.createElement("button");
  prev.innerText = "«";
  prev.classList.add("page-btn");

  if (data.first) {
    prev.disabled = true;
  } else {
    prev.onclick = () => aoMudarPagina(data.number - 1);
  }

  container.appendChild(prev);

  // NÚMEROS
  for (let i = 0; i < data.totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i + 1;
    btn.classList.add("page-btn");

    if (i === data.number) {
      btn.classList.add("active");
    }

    btn.onclick = () => aoMudarPagina(i);

    container.appendChild(btn);
  }

  // PRÓXIMO
  const next = document.createElement("button");
  next.innerText = "»";
  next.classList.add("page-btn");

  if (data.last) {
    next.disabled = true;
  } else {
    next.onclick = () => aoMudarPagina(data.number + 1);
  }

  container.appendChild(next);
}

// ===============================
// RENDERIZAR CONTEÚDO DA TELA DE DETALHES
// ===============================
export function renderizarDetalhes(brinquedo) {
  // Nome
  const titulo = document.getElementById("content-toy-title");
  if (titulo) {
    titulo.textContent = brinquedo.nome;
  }

  // Descrição
  const descricao = document.getElementById("content-toy-description");
  if (descricao) {
    descricao.innerHTML = `<p>${brinquedo.descricao}</p>`;
  }

  // Marca
  const marca = document.getElementById("content-toy-brand");
  if (marca) {
    marca.textContent = `Marca: ${brinquedo.marca?.nome || "N/A"}`;
  }

  // Preço
  const preco = document.getElementById("content-toy-price");
  if (preco) {
    preco.textContent = `R$ ${brinquedo.preco}`;
  }

  // Imagem

  const imagemHTML = document.getElementById("content-toy-img");

  if (imagemHTML) {
    imagemHTML.src = brinquedo.imagem
      ? `img/toys/${brinquedo.imagem}`
      : "img/placeholder.png";
  }
}
