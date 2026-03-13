// IMPORTS
import {
  buscarCategorias,
  buscarBrinquedos,
  buscarBrinquedosPorCategoria,
  buscarMarcas,
} from "./api.js";
import {
  renderizarCategorias,
  renderizarBrinquedos,
  renderizarMarcas,
} from "./render.js";
import { filtrarPorCategoria, filtrarPorMarca } from "./search.js"; // ativa a busca
import { iniciarCarrosselMarcas } from "./scripts.js"; // carrossel e interações da página

// ELEMENTOS
const categoriesContainer = document.querySelector("#categories-carousel");
const productsContainer = document.querySelector("#products-wrapper");
const brandsContainer = document.querySelector("#brands-carousel");

// CATEGORIAS
async function carregarCategorias() {
  const categorias = await buscarCategorias();
  renderizarCategorias(categoriesContainer, categorias, filtrarPorCategoria);
}

// MARCAS
async function carregarMarcas() {
  const marcas = await buscarMarcas();
  renderizarMarcas(brandsContainer, marcas, filtrarPorMarca);

  // INICIA O CARROSSEL DEPOIS
  iniciarCarrosselMarcas();
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
}

iniciarPagina();
