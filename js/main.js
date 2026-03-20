// ===============================
// IMPORTS
// ===============================

import { buscarCategorias, buscarBrinquedos, buscarMarcas } from "./api.js";

let paginaAtual = 0;
const tamanhoPagina = 16;
let ordenacao = "";

import {
  renderizarCategorias,
  renderizarFiltroCategorias,
  renderizarBrinquedos,
  renderizarMarcas,
  renderizarFiltroMarcas,
  renderizarPaginacao,
} from "./render.js";

import {
  filtrarPorCategoria,
  filtrarPorMarca,
  alterarCategoria,
  alterarMarca,
} from "./filters.js";

import { iniciarCarrosselMarcas } from "./scripts.js";
import { iniciarBusca, executarBusca } from "./search.js";

// ===============================
// FUNÇÃO AUXILIAR PARA COMPONENTES
// ===============================

async function loadComponent(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

// ===============================
// CARREGAR HEADER + FOOTER
// ===============================

async function carregarLayout() {
  await loadComponent("header", "components/header.html");
  await loadComponent("footer", "components/footer.html");
}

// ===============================
// PEGAR PARÂMETRO DA URL
// ===============================

function pegarParametroBusca() {
  const params = new URLSearchParams(window.location.search);
  return params.get("search");
}

// ===============================
// ELEMENTOS
// ===============================

const categoriesContainer = document.querySelector("#categories-carousel");
const productsContainer = document.querySelector("#products-wrapper");
const brandsContainer = document.querySelector("#brands-carousel");

const filtroCategoriasContainer = document.querySelector("#categories-filter");
const filtroMarcasContainer = document.querySelector("#brands-filter");

// ===============================
// CARREGAR CATEGORIAS
// ===============================

async function carregarCategorias() {
  const categorias = await buscarCategorias();
  renderizarCategorias(categoriesContainer, categorias, filtrarPorCategoria);
}

// ===============================
// FILTRO CATEGORIAS
// ===============================

async function carregarCategoriasFiltro() {
  const categorias = await buscarCategorias();

  renderizarFiltroCategorias(
    filtroCategoriasContainer,
    categorias,
    alterarCategoria,
  );
}

// ===============================
// CARREGAR MARCAS
// ===============================

async function carregarMarcas() {
  const marcas = await buscarMarcas();

  renderizarMarcas(brandsContainer, marcas, filtrarPorMarca);

  iniciarCarrosselMarcas();
}

// ===============================
// FILTRO MARCAS
// ===============================

async function carregarMarcasFiltro() {
  const marcas = await buscarMarcas();

  renderizarFiltroMarcas(filtroMarcasContainer, marcas, alterarMarca);
}

// ===============================
// FILTRO DE ORDENAÇÃO
// ===============================

// const ordenacaoSelect = document.getElementById("ordenacao-select");

// ordenacaoSelect.addEventListener("change", (e) => {
//   ordenacao = e.target.value;
//   carregarBrinquedos(0); // volta pra primeira página
// });

// ===============================
// CARREGAR BRINQUEDOS
// ===============================

async function carregarBrinquedos(page = 0) {
  paginaAtual = page;

  const resposta = await buscarBrinquedos(page, tamanhoPagina);

  if (!resposta || !resposta.content) {
    console.error("Resposta inválida:", resposta);
    return;
  }

  const brinquedos = resposta.content;

  renderizarBrinquedos(productsContainer, brinquedos);

  const paginacaoContainer = document.getElementById("pagination-container");

  renderizarPaginacao(paginacaoContainer, resposta, (novaPagina) => {
    carregarBrinquedos(novaPagina);

    /*
  const resposta = await filtrarBrinquedos({
  categorias: filtros.categorias,
  marcas: filtros.marcas,
  page: paginaAtual,
  size: tamanhoPagina,
  ordenacao
  });
    */
  });
}

// ===============================
// INICIALIZAÇÃO DA PÁGINA
// ===============================

async function iniciarPagina() {
  await carregarCategorias();
  await carregarMarcas();
  await carregarCategoriasFiltro();
  await carregarMarcasFiltro();
}

// ===============================
// START PRINCIPAL
// ===============================

async function start() {
  await carregarLayout(); // Cria header/footer

  iniciarBusca(); // Ativa busca global

  const busca = pegarParametroBusca();

  // Sempre carrega estrutura (SEM produtos ainda)
  await iniciarPagina();

  if (busca) {
    // Se veio com ?search=
    await executarBusca(busca);

    // opcional: preencher input
    const input = document.querySelector("#search-input");
    if (input) input.value = busca;
  } else {
    // Comportamento normal
    await carregarBrinquedos();
  }
}

start();
