// ===============================
// IMPORTS
// ===============================

import { obterImagem } from "./api.js";

import { formatarPreco } from "./utils/formatters.js";

import { aplicarMascaraTelefone } from "./utils/masks.js";

import { abrirBrinquedo } from "./router/brinquedoRouter.js";

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
    const card = document.createElement("div");
    card.classList.add("product-card");

    const imagem = obterImagem("toys", brinquedo.imagem);

    card.innerHTML = ` 
      <img 
        src="${imagem}" 
        alt="${brinquedo.nome}" 
        class="toy-img"
        onerror="this.onerror=null; this.src='img/placeholder.png'"
      />
      <h3 class="toy-title">${brinquedo.nome}</h3>
      <p class="toy-description">${brinquedo.descricao}</p>
      <p class="toy-price">R$ ${formatarPreco(brinquedo.preco)}</p>
      
      <button class="quick-view-btn btn" 
        data-id="${brinquedo.id}"> 
        <i class="fa-solid fa-eye"></i> Espiar
      </button>
    `;

    // 2. Abrir a tela de detalhes ao clicar no card (no fundo branco)
    card.addEventListener("click", (event) => {
      // Verifica se o clique NÃO foi no botão "Espiar"
      if (!event.target.closest(".quick-view-btn")) {
        abrirBrinquedo(brinquedo.id);
      }
    });

    // Função fora para não ativar clique duplo ao tentar usar a quick view
    const quickBtn = card.querySelector(".quick-view-btn");

    quickBtn.addEventListener("click", (e) => {
      renderizarQuickViewBrinquedos(brinquedo);

      const modal = document.getElementById("quick-view-modal");
      if (modal) modal.classList.add("mostrar");
    });

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("close-btn")) {
        const modal = document.getElementById("quick-view-modal");
        if (modal) modal.classList.remove("mostrar");
      }
    });

    container.appendChild(card);
  });
}

// ===============================
// RENDERIZAR QUICK VIEW DOS BRINQUEDOS
// ===============================
export function renderizarQuickViewBrinquedos(brinquedo) {
  const titulo = document.getElementById("qv-title");
  const preco = document.getElementById("qv-price");
  const desc = document.getElementById("qv-desc");
  const img = document.getElementById("qv-img");

  if (titulo) titulo.textContent = brinquedo.nome;
  if (preco) preco.textContent = `R$ ${formatarPreco(brinquedo.preco)}`;
  if (desc) desc.textContent = brinquedo.descricao;

  if (!img) return;

  img.src = obterImagem("toys", brinquedo.imagem);

  img.onerror = () => {
    img.onerror = null; // evita loop infinito
    img.src = "img/placeholder.png";
  };
}

// ===============================
// RENDERIZAR TELA DE ALTERAR
// ===============================

export function renderizarAlterarBrinquedo(brinquedo) {
  document.getElementById("id-input").value = brinquedo.id;
  document.getElementById("nome-input").value = brinquedo.nome;
  document.getElementById("descricao-input").value = brinquedo.descricao;
  document.getElementById("preco-input").value = formatarPreco(brinquedo.preco);

  document.getElementById("marca-input").value = brinquedo.marca?.id;
  document.getElementById("categoria-input").value = brinquedo.categoria?.id;

  const imgPreview = document.getElementById("img-preview");

  if (!imgPreview) return;

  imgPreview.src = obterImagem("toys", brinquedo.imagem);

  //  Caso  a imagem seja apagada ou não exista no server
  imgPreview.onerror = () => {
    imgPreview.onerror = null; // evita loop infinito
    imgPreview.src = "img/placeholder.png";
  };
}

// ===============================
// RENDERIZAR TELA DE PERFIL
// ===============================
export function renderizarPerfil(usuario) {
  // Dados básicos
  document.getElementById("nome-input").value = usuario.nome || "";
  document.getElementById("email-input").value = usuario.email || "";

  // Contato
  // Para puxar o telefone com máscara na tela de Perfil
  document.getElementById("number-input").value = usuario.telefone
    ? aplicarMascaraTelefone(usuario.telefone)
    : "";
  document.getElementById("email-input-right").value = usuario.email || "";

  // Endereço (pode ser null!)
  if (usuario.endereco) {
    document.getElementById("cep-input").value = usuario.endereco.cep || "";

    document.getElementById("endereco-input").value =
      usuario.endereco.logradouro || "";

    document.getElementById("bairro-input").value =
      usuario.endereco.bairro || "";

    document.getElementById("numero-input").value =
      usuario.endereco.numero || "";

    document.getElementById("city-select").innerHTML =
      `<option>${usuario.endereco.cidade}</option>`;

    document.getElementById("state-select").innerHTML =
      `<option>${usuario.endereco.estado}</option>`;
  } else {
    // Se não tiver endereço → limpa tudo
    document.getElementById("cep-input").value = "";
    document.getElementById("endereco-input").value = "";
    document.getElementById("bairro-input").value = "";
    document.getElementById("numero-input").value = "";

    document.getElementById("city-select").innerHTML =
      `<option>Selecione</option>`;

    document.getElementById("state-select").innerHTML =
      `<option>Selecione</option>`;
  }
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
    preco.textContent = `R$ ${formatarPreco(brinquedo.preco)}`;
  }

  // Imagem

  const imagemHTML = document.getElementById("content-toy-img");

  if (imagemHTML) {
    const imagem = obterImagem("toys", brinquedo.imagem);

    imagemHTML.src = imagem;

    imagemHTML.onerror = () => {
      imagemHTML.onerror = null;
      imagemHTML.src = "img/placeholder.png";
    };
  }
}
