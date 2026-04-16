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

  const params = new URLSearchParams(window.location.search);
  params.set("page", page);

  window.history.pushState({}, "", `?${params.toString()}`);

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
  const params = new URLSearchParams(window.location.search);

  if (tipo === "categoria") {
    if (marcado) {
      if (!filtros.categorias.includes(id)) {
        filtros.categorias.push(id);
      }
    } else {
      filtros.categorias = filtros.categorias.filter((c) => c !== id);
    }

    if (filtros.categorias.length > 0) {
      params.set("categoria", filtros.categorias.join(","));
    } else {
      params.delete("categoria");
    }
  }

  if (tipo === "marca") {
    if (marcado) {
      if (!filtros.marcas.includes(id)) {
        filtros.marcas.push(id);
      }
    } else {
      filtros.marcas = filtros.marcas.filter((m) => m !== id);
    }

    if (filtros.marcas.length > 0) {
      params.set("marca", filtros.marcas.join(","));
    } else {
      params.delete("marca");
    }
  }

  window.history.pushState({}, "", `?${params.toString()}`);

  carregarBrinquedos(0);
}

function restaurarFiltrosDaURL() {
  const params = new URLSearchParams(window.location.search);

  const categorias = params.get("categoria");
  const marcas = params.get("marca");

  // ===============================
  // RESTAURAR CATEGORIAS
  // ===============================
  if (categorias) {
    const ids = categorias.split(",");

    ids.forEach((id) => {
      const checkbox = document.querySelector(
        `#categories-filter input[value="${id}"]`,
      );

      if (checkbox) {
        checkbox.checked = true;

        // atualiza estado interno também
        filtros.categorias.push(Number(id));
      }
    });
  }

  // ===============================
  // RESTAURAR MARCAS
  // ===============================
  if (marcas) {
    const ids = marcas.split(",");

    ids.forEach((id) => {
      const checkbox = document.querySelector(
        `#brands-filter input[value="${id}"]`,
      );

      if (checkbox) {
        checkbox.checked = true;

        filtros.marcas.push(Number(id));
      }
    });
  }

  function abrirDropdownSeTemFiltro(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const algumMarcado = container.querySelector("input:checked");

    if (algumMarcado) {
      const botao = container.previousElementSibling; // botão do dropdown
      if (botao) {
        botao.classList.add("open");
        container.classList.add("open");
      }
    }
  }

  abrirDropdownSeTemFiltro("#categories-filter");
  abrirDropdownSeTemFiltro("#brands-filter");
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

  restaurarFiltrosDaURL();

  const params = new URLSearchParams(window.location.search);

  const categoriasParam = params.get("categoria");
  const marcasParam = params.get("marca");
  const ordenacaoParam = params.get("ordenacao");
  const pageParam = params.get("page");
  const busca = params.get("search");

  if (categoriasParam) {
    filtros.categorias = categoriasParam.split(",").map(Number);
  }

  if (marcasParam) {
    filtros.marcas = marcasParam.split(",").map(Number);
  }

  if (ordenacaoParam) {
    ordenacao = ordenacaoParam;
  }

  const paginaInicial = pageParam ? Number(pageParam) : 0;

  if (busca) {
    await executarBusca(busca);
  } else {
    await carregarBrinquedos(paginaInicial);
  }

  restaurarScroll();

  // ===============================
  // ORDENAÇÃO
  // ===============================
  const ordenacaoSelect = document.getElementById("ordenacao-select");

  if (ordenacaoSelect) {
    if (ordenacao) {
      ordenacaoSelect.value = ordenacao;
    }

    ordenacaoSelect.addEventListener("change", (e) => {
      ordenacao = e.target.value;

      const params = new URLSearchParams(window.location.search);
      params.set("ordenacao", ordenacao);

      window.history.pushState({}, "", `?${params.toString()}`);

      carregarBrinquedos(0);
    });
  }

  setAtualizarFiltrosCallback(atualizarFiltros);
}
