// ===============================
// IMPORTS
// ===============================
import {
  buscarCategorias,
  buscarMarcas,
  filtrarBrinquedos,
  buscarBrinquedoPorId,
} from "../api.js";

import { adicionarAoCarrinho } from "../services/cartService.js";

import { atualizarTextoCarrinho } from "../components/header.js";

import {
  renderizarCategorias,
  renderizarFiltroCategorias,
  renderizarBrinquedos,
  renderizarMarcas,
  renderizarFiltroMarcas,
  renderizarPaginacao,
} from "../render.js";

import {
  filtrarPorCategoria,
  filtrarPorMarca,
  alterarCategoria,
  alterarMarca,
  setAtualizarFiltrosCallback,
} from "../filters.js";

import { iniciarCarrosselMarcas } from "../scripts.js";

// ===============================
// CONFIG
// ===============================
const tamanhoPagina = 16;

// ===============================
// CARREGAMENTOS
// ===============================
async function carregarCategorias() {
  const container = document.querySelector("#categories-carousel");
  if (!container) return;

  const categorias = await buscarCategorias();
  renderizarCategorias(container, categorias, filtrarPorCategoria);
}

async function carregarMarcas() {
  const container = document.querySelector("#brands-carousel");
  if (!container) return;

  const marcas = await buscarMarcas();
  renderizarMarcas(container, marcas, filtrarPorMarca);

  iniciarCarrosselMarcas();
}

async function carregarMarcasSimples() {
  const container = document.querySelector("#brands-simple-carousel");
  if (!container) return;

  const marcas = await buscarMarcas();
  renderizarMarcas(container, marcas, filtrarPorMarca);
}

async function carregarCategoriasFiltro() {
  const container = document.querySelector("#categories-filter");
  if (!container) return;

  const categorias = await buscarCategorias();
  renderizarFiltroCategorias(container, categorias, alterarCategoria);
}

async function carregarMarcasFiltro() {
  const container = document.querySelector("#brands-filter");
  if (!container) return;

  const marcas = await buscarMarcas();
  renderizarFiltroMarcas(container, marcas, alterarMarca);
}

// ===============================
//  MODO BUSCA (UI)
// ===============================
function aplicarModoBusca(valor, brinquedos) {
  const productsContainer = document.querySelector("#products-wrapper");
  const toysTitle = document.querySelector("#toysContainer-title");
  const categoriesContainer = document.querySelector("#categories-container");
  const brandsContainer = document.querySelector("#brands-container");
  const brandsSection = document.querySelector("#brands-simple-container");

  if (categoriesContainer) categoriesContainer.style.display = "none";
  if (brandsContainer) brandsContainer.style.display = "none";
  if (brandsSection) brandsSection.style.display = "none";

  if (toysTitle) {
    toysTitle.innerText =
      brinquedos.length === 0
        ? `Nenhum resultado para: "${valor}"`
        : `Resultados para: ${valor}`;
  }

  renderizarBrinquedos(productsContainer, brinquedos);
}

// ===============================
//  MODO NORMAL (UI)
// ===============================
function restaurarModoNormal() {
  const categoriesContainer = document.querySelector("#categories-container");
  const brandsContainer = document.querySelector("#brands-container");
  const brandsSection = document.querySelector("#brands-simple-container");
  const toysTitle = document.querySelector("#toysContainer-title");

  if (categoriesContainer) categoriesContainer.style.display = "";
  if (brandsContainer) brandsContainer.style.display = "";
  if (brandsSection) brandsSection.style.display = "none";

  if (toysTitle) {
    toysTitle.innerText = "Brinquedos";
  }
}

// ===============================
// BRINQUEDOS (FONTE ÚNICA)
// ===============================
async function carregarBrinquedos(page = 0) {
  const container = document.querySelector("#products-wrapper");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);

  const search = params.get("search");

  const categorias = params.get("categoria")
    ? params.get("categoria").split(",").map(Number)
    : [];

  const marcas = params.get("marca")
    ? params.get("marca").split(",").map(Number)
    : [];

  const ordenacao = params.get("ordenacao");

  params.set("page", page);
  window.history.pushState({}, "", `?${params.toString()}`);

  const resposta = await filtrarBrinquedos({
    categorias,
    marcas,
    page,
    size: tamanhoPagina,
    ordenacao,
    search,
  });

  const brinquedos = resposta.content;

  if (search) {
    aplicarModoBusca(search, brinquedos);
  } else {
    restaurarModoNormal();
    renderizarBrinquedos(container, brinquedos);
  }

  // ===============================
  // PAGINAÇÃO
  // ===============================
  const paginacao = document.querySelector("#pagination-container");
  if (!paginacao) return;

  renderizarPaginacao(paginacao, resposta, (novaPagina) => {
    carregarBrinquedos(novaPagina);
  });
}

// ===============================
// FILTROS (BASEADOS NA URL)
// ===============================
function atualizarFiltros(tipo, id, marcado) {
  const params = new URLSearchParams(window.location.search);

  const chave = tipo === "categoria" ? "categoria" : "marca";

  let lista = params.get(chave) ? params.get(chave).split(",") : [];

  if (marcado) {
    if (!lista.includes(String(id))) lista.push(String(id));
  } else {
    lista = lista.filter((item) => item !== String(id));
  }

  if (lista.length > 0) {
    params.set(chave, lista.join(","));
  } else {
    params.delete(chave);
  }

  params.set("page", 0);

  window.history.pushState({}, "", `?${params.toString()}`);

  carregarBrinquedos(0);
}

// ===============================
// RESTAURAR FILTROS VISUAIS
// ===============================
function restaurarFiltrosDaURL() {
  const params = new URLSearchParams(window.location.search);

  const categorias = params.get("categoria");
  const marcas = params.get("marca");

  if (categorias) {
    categorias.split(",").forEach((id) => {
      const checkbox = document.querySelector(
        `#categories-filter input[value="${id}"]`,
      );
      if (checkbox) checkbox.checked = true;
    });
  }

  if (marcas) {
    marcas.split(",").forEach((id) => {
      const checkbox = document.querySelector(
        `#brands-filter input[value="${id}"]`,
      );
      if (checkbox) checkbox.checked = true;
    });
  }

  function abrirDropdown(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    if (container.querySelector("input:checked")) {
      const botao = container.previousElementSibling;
      if (botao) {
        botao.classList.add("open");
        container.classList.add("open");
      }
    }
  }

  abrirDropdown("#categories-filter");
  abrirDropdown("#brands-filter");
}

// ===============================
// SCROLL
// ===============================
function restaurarScroll() {
  const scroll = sessionStorage.getItem("scrollPosition");

  if (scroll) {
    setTimeout(() => {
      window.scrollTo(0, parseInt(scroll));
      sessionStorage.removeItem("scrollPosition");
    }, 150);
  }
}

// ===============================
// INIT
// ===============================
export async function iniciarHome() {
  await carregarCategorias();
  await carregarMarcas();
  await carregarCategoriasFiltro();
  await carregarMarcasFiltro();
  await carregarMarcasSimples();

  await iniciarBotaoCarrinhoQuickView();
  restaurarFiltrosDaURL();

  const params = new URLSearchParams(window.location.search);
  const busca = params.get("search");

  if (busca) {
    const input = document.querySelector("#search-input");
    const navbar = document.querySelector("#busca-navbar");

    if (input) input.value = busca;
    if (navbar) navbar.classList.add("active");
  }

  const pageParam = params.get("page");
  const paginaInicial = pageParam ? Number(pageParam) : 0;

  await carregarBrinquedos(paginaInicial);

  restaurarScroll();

  //  ESSENCIAL PRA BUSCA FUNCIONAR
  window.addEventListener("filtrosAtualizados", () => {
    carregarBrinquedos(0);
  });

  // ===============================
  // ORDENAÇÃO
  // ===============================
  const ordenacaoSelect = document.getElementById("ordenacao-select");

  if (ordenacaoSelect) {
    const ordenacao = params.get("ordenacao");
    if (ordenacao) ordenacaoSelect.value = ordenacao;

    ordenacaoSelect.addEventListener("change", (e) => {
      const params = new URLSearchParams(window.location.search);

      params.set("ordenacao", e.target.value);
      params.set("page", 0);

      window.history.pushState({}, "", `?${params.toString()}`);

      window.scrollTo(0, 0);

      carregarBrinquedos(0);
    });
  }

  setAtualizarFiltrosCallback(atualizarFiltros);
}

export function iniciarBotaoCarrinhoQuickView() {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("#adicionar-carrinho-quick-view-btn");
    if (!btn) return;

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
      window.location.href = "login.html";
      return;
    }

    const titulo = document.querySelector("#qv-title");
    if (!titulo) return;

    const id = titulo.dataset.id;

    if (!id) return;

    try {
      const produto = await buscarBrinquedoPorId(id);

      if (!produto) return;

      adicionarAoCarrinho(produto);

      atualizarTextoCarrinho();

      btn.innerHTML = "Adicionado ✔";
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML =
          "Adicionar ao Carrinho <i class='fa-solid fa-cart-shopping'></i>";
        btn.disabled = false;
      }, 1200);
    } catch (err) {
      console.error("Erro ao adicionar ao carrinho:", err);
    }
  });
}
