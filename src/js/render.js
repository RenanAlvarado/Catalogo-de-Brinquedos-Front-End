// ===============================
// IMPORTS
// ===============================

import { obterImagem } from "./api.js";

import { isAdmin } from "./services/authService.js";

import { formatarPreco } from "./utils/formatters.js";

import { aplicarMascaraTelefone } from "./utils/masks.js";

import { abrirBrinquedo } from "./router/brinquedoRouter.js";

import { abrirCategoria } from "./router/categoriaRouter.js";

import { abrirMarca } from "./router/marcaRouter.js";

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

  const admin = isAdmin();

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

      ${
        admin
          ? `<button class="quick-view-btn-categories btn">
              <i class="fa-solid fa-pencil"></i> Editar
             </button>`
          : ""
      }
    `;

    const quickBtn = card.querySelector(".quick-view-btn-categories");

    if (quickBtn && admin) {
      quickBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirCategoria(categoria.id);
      });
    }

    card.addEventListener("click", (event) => {
      if (!event.target.closest(".quick-view-btn-categories")) {
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

  const admin = isAdmin();

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

      ${
        admin
          ? `<button class="quick-view-btn-brands btn">
              <i class="fa-solid fa-pencil"></i> Editar
             </button>`
          : ""
      }
    `;

    const quickBtn = card.querySelector(".quick-view-btn-brands");

    if (quickBtn && admin) {
      quickBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirMarca(marca.id);
      });
    }

    card.addEventListener("click", (event) => {
      if (!event.target.closest(".quick-view-btn-brands")) {
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

  const cartBtn = document.getElementById("adicionar-carrinho-quick-view-btn");

  const admin = isAdmin();

  if (admin && cartBtn) {
    cartBtn.style.display = "none";
  }

  if (titulo) {
    titulo.textContent = brinquedo.nome;
    titulo.dataset.id = brinquedo.id;
  }
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
// RENDERIZAR TELA DE ALTERAR BRINQUEDO
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
// RENDERIZAR TELA DE ALTERAR CATEGORIA
// ===============================

export function renderizarAlterarCategoria(categoria) {
  document.getElementById("id-input").value = categoria.id;
  document.getElementById("nome-input").value = categoria.nome;

  const imgPreview = document.getElementById("img-preview");

  if (!imgPreview) return;

  imgPreview.src = obterImagem("categories", categoria.imagem);

  //  Caso  a imagem seja apagada ou não exista no server
  imgPreview.onerror = () => {
    imgPreview.onerror = null; // evita loop infinito
    imgPreview.src = "img/placeholder.png";
  };
}

// ===============================
// RENDERIZAR TELA DE ALTERAR MARCA
// ===============================

export function renderizarAlterarMarca(marca) {
  document.getElementById("id-input").value = marca.id;
  document.getElementById("nome-input").value = marca.nome;

  const imgPreview = document.getElementById("img-preview");

  if (!imgPreview) return;

  imgPreview.src = obterImagem("brands", marca.imagem);

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
  // Imagem

  const imagemHTML = document.getElementById("user-img-preview");

  if (imagemHTML) {
    const imagem = obterImagem("usuarios", usuario.imagem);

    imagemHTML.src = imagem;

    imagemHTML.onerror = () => {
      imagemHTML.onerror = null;
      imagemHTML.src = "img/perfil.png";
    };
  }
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
    const endereco = usuario.endereco;

    document.getElementById("cep-input").value = endereco.cep || "";
    document.getElementById("endereco-input").value = endereco.logradouro || "";
    document.getElementById("bairro-input").value = endereco.bairro || "";
    document.getElementById("numero-input").value = endereco.numero || "";

    const cidade = endereco.cidade ? endereco.cidade : "Selecione";
    const estado = endereco.estado ? endereco.estado : "Selecione";

    document.getElementById("city-select").innerHTML =
      `<option>${cidade}</option>`;

    document.getElementById("state-select").innerHTML =
      `<option>${estado}</option>`;
  } else {
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

  window.scrollTo(0, 500);

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

// ===============================
// RENDERIZAR CARRINHO (APENAS UI)
// ===============================

export function renderizarCarrinho(carrinho) {
  const container = document.querySelector("#cart-items-section");
  const subtotalEl = document.querySelector(".total-line span:last-child");
  const itensEl = document.querySelector(".summary-line span");

  if (!container) return;

  container.innerHTML = "";

  // carrinho vazio
  if (!Array.isArray(carrinho) || carrinho.length === 0) {
    container.innerHTML = `<p>Seu carrinho está vazio.</p>`;

    if (subtotalEl) subtotalEl.textContent = "R$ 0,00";
    if (itensEl) itensEl.textContent = "Subtotal (0 itens)";
    return;
  }

  carrinho.forEach((item) => {
    const preco = Number(item.preco) || 0;

    const marca =
      typeof item.marca === "object" ? item.marca?.nome : item.marca || "";

    const imagem = obterImagem("toys", item.imagem);

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <img 
        src="${imagem}" 
        class="item-img"
        alt="${item.nome}"
        onerror="this.onerror=null; this.src='img/placeholder.png'"
      />

      <div class="item-info">
        <h3>${item.nome}</h3>
        <p class="item-brand">${marca}</p>
        <p class="item-price">R$ ${formatarPreco(preco)}</p>
      </div>

      <div class="item-actions">
        <div class="quantity-control">
          <button class="qtd-btn minus" data-id="${item.id}">-</button>
          <input type="text" value="${item.quantidade}" readonly />
          <button class="qtd-btn plus" data-id="${item.id}">+</button>
        </div>

        <button class="remove-btn" data-id="${item.id}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;

    container.appendChild(div);
  });

  atualizarResumoCarrinho(carrinho);
}

// ===============================
// RESUMO (APENAS UI)
// ===============================

export function atualizarResumoCarrinho(carrinho) {
  const subtotalEl = document.querySelector(".total-line span:last-child");
  const itensEl = document.querySelector(".summary-line span");

  if (!carrinho) return;

  const subtotal = carrinho.reduce(
    (acc, item) => acc + (Number(item.preco) || 0) * item.quantidade,
    0,
  );

  const itens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  if (subtotalEl) {
    subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
  }

  if (itensEl) {
    itensEl.textContent = `Subtotal (${itens} itens)`;
  }
}
