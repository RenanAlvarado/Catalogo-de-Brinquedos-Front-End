// ===============================
// IMPORTS
// ===============================
import { buscarCategorias, buscarMarcas, filtrarBrinquedos } from "../api.js";

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
import { executarBusca } from "../search.js";

// ===============================
// ESTADOS
// ===============================
let filtros = {
  categorias: [],
  marcas: [],
};

let ordenacao = "";
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
// BRINQUEDOS
// ===============================
async function carregarBrinquedos(page = 0) {
  const container = document.querySelector("#products-wrapper");
  if (!container) return;

  const resposta = await filtrarBrinquedos({
    categorias: filtros.categorias,
    marcas: filtros.marcas,
    page,
    size: tamanhoPagina,
    ordenacao,
  });

  const brinquedos = resposta.content;
  renderizarBrinquedos(container, brinquedos);

  const paginacao = document.querySelector("#pagination-container");
  if (!paginacao) return;

  renderizarPaginacao(paginacao, resposta, (novaPagina) => {
    carregarBrinquedos(novaPagina);
  });
}

// ===============================
// FILTROS
// ===============================
function atualizarFiltros(tipo, id, marcado) {
  if (tipo === "categoria") {
    if (marcado) filtros.categorias.push(id);
    else filtros.categorias = filtros.categorias.filter((c) => c !== id);
  }

  if (tipo === "marca") {
    if (marcado) filtros.marcas.push(id);
    else filtros.marcas = filtros.marcas.filter((m) => m !== id);
  }

  carregarBrinquedos(0);
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
// INIT HOME
// ===============================
export async function iniciarHome() {
  await carregarCategorias();
  await carregarMarcas();
  await carregarCategoriasFiltro();
  await carregarMarcasFiltro();
  await carregarMarcasSimples();

  const params = new URLSearchParams(window.location.search);
  const busca = params.get("search");

  if (busca) {
    await executarBusca(busca);
  } else {
    await carregarBrinquedos();
  }

  restaurarScroll();

  const ordenacaoSelect = document.getElementById("ordenacao-select");

  if (ordenacaoSelect) {
    ordenacaoSelect.addEventListener("change", (e) => {
      ordenacao = e.target.value;
      carregarBrinquedos(0);
    });
  }

  setAtualizarFiltrosCallback(atualizarFiltros);
}
