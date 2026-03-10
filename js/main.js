// IMPORTS
import { buscarCategorias, buscarBrinquedos } from "./api.js";
import { renderizarCategorias, renderizarBrinquedos } from "./render.js";
import "./search.js"; // ativa a busca
import "./scripts.js"; // carrossel e interações da página

// ELEMENTOS
const categoriesContainer = document.querySelector("#categories-carousel");
const productsContainer = document.querySelector("#products-wrapper");

// CATEGORIAS
async function carregarCategorias() {
  const categorias = await buscarCategorias();
  renderizarCategorias(categoriesContainer, categorias);
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
}

iniciarPagina();
