// ===============================
// IMPORTS
// ===============================

import { buscarCategorias, buscarBrinquedos, buscarMarcas } from "./api.js";

let paginaAtual = 0;
const tamanhoPagina = 16;

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
import { iniciarBusca } from "./search.js";

// ===============================
// FUNÇÃO AUXILIAR PARA CARREGAR COMPONENTES REPETIDOS
// ===============================
async function loadComponent(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

// Aqui é o carregamento dos itens modularizados
async function carregarLayout() {
  await loadComponent("footer", "components/footer.html");
  await loadComponent("header", "components/header.html");
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
// CARREGAR CATEGORIAS (CARROSSEL)
// ===============================

async function carregarCategorias() {
  const categorias = await buscarCategorias();

  renderizarCategorias(categoriesContainer, categorias, filtrarPorCategoria);
}

// ===============================
// FILTRO DE CATEGORIAS
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
// CARREGAR MARCAS (CARROSSEL)
// ===============================

async function carregarMarcas() {
  const marcas = await buscarMarcas();

  renderizarMarcas(brandsContainer, marcas, filtrarPorMarca);

  // inicia o carrossel depois que renderiza
  iniciarCarrosselMarcas();
}

// ===============================
// FILTRO DE MARCAS
// ===============================

async function carregarMarcasFiltro() {
  const marcas = await buscarMarcas();

  renderizarFiltroMarcas(filtroMarcasContainer, marcas, alterarMarca);
}

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
  });
}

// Lista todos os brinquedos
/*async function carregarBrinquedos() {
  const brinquedos = await buscarBrinquedos();

  renderizarBrinquedos(productsContainer, brinquedos);
}
*/

// ===============================
// INICIALIZAÇÃO DA PÁGINA
// ===============================

async function iniciarPagina() {
  await carregarCategorias();
  await carregarBrinquedos();
  await carregarMarcas();
  await carregarCategoriasFiltro();
  await carregarMarcasFiltro();
}

async function start() {
  await carregarLayout();
  iniciarBusca();
  await iniciarPagina();
}

start();
