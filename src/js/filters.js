// ===============================
// IMPORTS
// ===============================

import {
  buscarBrinquedosPorCategoria,
  buscarBrinquedosPorMarca,
} from "./api.js";

import { renderizarBrinquedos } from "./render.js";

// ===============================
// ELEMENTOS
// ===============================

const mainContainer = document.querySelector("#main-container");
const brandsContainer = document.querySelector("#brands-container");
const productsContainer = document.querySelector("#products-wrapper");
const toysTitle = document.querySelector("#toysContainer-title");

// ===============================
// CRIAR BOTÃO DE VOLTAR AO MENU
// ===============================

async function criarBotaoVoltar() {
  // verifica se já existe esse id no código
  if (document.querySelector("#return-index-btn")) {
    return;
  }

  const link = document.createElement("a");
  link.href = "index.html";

  const button = document.createElement("button");
  button.classList.add("btn");
  button.id = "return-index-btn";
  button.textContent = "Voltar ao Menu Principal";

  link.appendChild(button);

  mainContainer.prepend(link);
}

// ===============================
// ESTADO
// ===============================

let atualizarFiltrosCallback = null;

// função para o main.js registrar callback
export function setAtualizarFiltrosCallback(callback) {
  atualizarFiltrosCallback = callback;
}

// ===============================
// ALTERAR CATEGORIA
// ===============================

export function alterarCategoria(id, marcado) {
  if (atualizarFiltrosCallback) {
    atualizarFiltrosCallback("categoria", id, marcado);
  }
}

// ===============================
// ALTERAR MARCA
// ===============================

export function alterarMarca(id, marcado) {
  if (atualizarFiltrosCallback) {
    atualizarFiltrosCallback("marca", id, marcado);
  }
}

// ===============================
// FILTRAR POR CATEGORIA (CARROSSEL)
// ===============================
export async function filtrarPorCategoria(id, nomeCategoria) {
  brandsContainer.style.display = "none";

  criarBotaoVoltar();

  try {
    const brinquedos = await buscarBrinquedosPorCategoria(id);

    if (brinquedos.length === 0) {
      toysTitle.innerText = `Nenhum produto encontrado para a Categoria: ${nomeCategoria}`;
    } else {
      toysTitle.innerText = `Categoria: ${nomeCategoria}`;
    }

    renderizarBrinquedos(productsContainer, brinquedos);
  } catch (erro) {
    console.error("Erro ao filtrar categoria:", erro);
  }
}

// ===============================
// FILTRAR POR MARCA (CARROSSEL)
// ===============================

export async function filtrarPorMarca(id, nomeMarca) {
  brandsContainer.style.display = "none";

  criarBotaoVoltar();

  try {
    const brinquedos = await buscarBrinquedosPorMarca(id);

    if (brinquedos.length === 0) {
      toysTitle.innerText = `Nenhum produto encontrado para a Marca: ${nomeMarca}`;
    } else {
      toysTitle.innerText = `Marca: ${nomeMarca}`;
    }

    renderizarBrinquedos(productsContainer, brinquedos);
  } catch (erro) {
    console.error("Erro ao filtrar Marca:", erro);
  }
}
