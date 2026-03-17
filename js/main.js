// ===============================
// IMPORTS
// ===============================

import { buscarCategorias, buscarBrinquedos, buscarMarcas } from "./api.js";

import {
  renderizarCategorias,
  renderizarFiltroCategorias,
  renderizarBrinquedos,
  renderizarMarcas,
  renderizarFiltroMarcas,
} from "./render.js";

import {
  filtrarPorCategoria,
  filtrarPorMarca,
  alterarCategoria,
  alterarMarca,
} from "./filters.js";

import { iniciarCarrosselMarcas } from "./scripts.js";
import "./search.js";

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

async function carregarBrinquedos() {
  const brinquedos = await buscarBrinquedos();

  renderizarBrinquedos(productsContainer, brinquedos);
}

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

iniciarPagina();
