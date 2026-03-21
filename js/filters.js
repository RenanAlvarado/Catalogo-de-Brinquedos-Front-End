// ===============================
// IMPORTS
// ===============================

import {
  buscarBrinquedos,
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
// ESTADO DOS FILTROS
// ===============================

let categoriasSelecionadas = [];
let marcasSelecionadas = [];
let resultados = [];

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

// ===============================
// ALTERAR CATEGORIA (CHECKBOX)
// ===============================

export function alterarCategoria(id, marcado) {
  if (marcado) {
    categoriasSelecionadas.push(id);
  } else {
    categoriasSelecionadas = categoriasSelecionadas.filter((c) => c !== id);
  }

  aplicarFiltros();
}

// ===============================
// ALTERAR MARCA (CHECKBOX)
// ===============================

export function alterarMarca(id, marcado) {
  if (marcado) {
    marcasSelecionadas.push(id);
  } else {
    marcasSelecionadas = marcasSelecionadas.filter((m) => m !== id);
  }

  aplicarFiltros();
}

// ===============================
// APLICAR FILTROS
// ===============================

async function aplicarFiltros() {
  //Nenhum filtro selecionado
  if (categoriasSelecionadas.length === 0 && marcasSelecionadas.length === 0) {
    const resposta = await buscarBrinquedos();
    const brinquedos = resposta.content || resposta;

    toysTitle.innerText = "Lista de Produtos";

    renderizarBrinquedos(productsContainer, brinquedos);

    return;
  }

  // filtrar por categorias
  for (const id of categoriasSelecionadas) {
    const brinquedos = await buscarBrinquedosPorCategoria(id);

    const resposta = await buscarBrinquedosPorCategoria(id);
    const lista = resposta.content || resposta;

    resultados.push(...lista);
  }

  // filtrar por marcas
  for (const id of marcasSelecionadas) {
    const brinquedos = await buscarBrinquedosPorMarca(id);

    const resposta = await buscarBrinquedosPorMarca(id);
    const lista = resposta.content || resposta;

    resultados.push(...lista);
  }

  renderizarBrinquedos(productsContainer, resultados);
}
