// IMPORTS
import { buscarCategorias, buscarBrinquedos, buscarMarcas } from "./api.js";
import {
  renderizarCategorias,
  renderizarFiltroCategorias,
  renderizarBrinquedos,
  renderizarMarcas,
  renderizarFiltroMarcas,
} from "./render.js";
import { filtrarPorCategoria, filtrarPorMarca } from "./search.js"; // ativa a busca
import { iniciarCarrosselMarcas } from "./scripts.js"; // carrossel e interações da página

// ELEMENTOS
const categoriesContainer = document.querySelector("#categories-carousel");
const productsContainer = document.querySelector("#products-wrapper");
const brandsContainer = document.querySelector("#brands-carousel");
const filtroCategoriasContainer = document.querySelector("#categories-filter");
const filtroMarcasContainer = document.querySelector("#brands-filter");

// CATEGORIAS
async function carregarCategorias() {
  const categorias = await buscarCategorias();
  renderizarCategorias(categoriesContainer, categorias, filtrarPorCategoria);
}

//Filtros de Categoria
async function carregarCategoriasFiltro() {
  const categorias = await buscarCategorias();

  renderizarFiltroCategorias(filtroCategoriasContainer, categorias);
}
// MARCAS
async function carregarMarcas() {
  const marcas = await buscarMarcas();
  renderizarMarcas(brandsContainer, marcas, filtrarPorMarca);

  // INICIA O CARROSSEL DEPOIS
  iniciarCarrosselMarcas();
}

//Filtros de Marca
async function carregarMarcasFiltro() {
  const marcas = await buscarMarcas();

  renderizarFiltroMarcas(filtroMarcasContainer, marcas);
}

// BRINQUEDOS
async function carregarBrinquedos() {
  const brinquedos = await buscarBrinquedos();
  renderizarBrinquedos(productsContainer, brinquedos);
}

// INICIALIZAÇÃO
async function iniciarPagina() {
  await carregarCategorias();
  await carregarBrinquedos();
  await carregarMarcas();
  await carregarCategoriasFiltro();
  await carregarMarcasFiltro();
}

iniciarPagina();
