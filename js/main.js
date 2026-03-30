// ===============================
// IMPORTS
// ===============================

import {
  buscarCategorias,
  buscarBrinquedos,
  buscarMarcas,
  filtrarBrinquedos,
  buscarBrinquedoPorId,
} from "./api.js";

import {
  renderizarCategorias,
  renderizarFiltroCategorias,
  renderizarBrinquedos,
  renderizarMarcas,
  renderizarFiltroMarcas,
  renderizarPaginacao,
  renderizarDetalhes,
} from "./render.js";

import {
  filtrarPorCategoria,
  filtrarPorMarca,
  alterarCategoria,
  alterarMarca,
  setAtualizarFiltrosCallback,
} from "./filters.js";

import { iniciarCarrosselMarcas } from "./scripts.js";

import { iniciarBusca, executarBusca } from "./search.js";

// Inicialização dos filtros
let filtros = {
  categorias: [],
  marcas: [],
};

// Variável que inicia a ordenação
let ordenacao = "";

// ===============================
// FUNÇÃO AUXILIAR PARA VER SE O COMPONENTES EXISTE
// ===============================
function getEl(selector) {
  const el = document.querySelector(selector);

  if (!el) {
    // opcional: log leve (ou pode remover depois)
    console.warn(`Elemento não encontrado: ${selector}`);
  }

  return el;
}

// ===============================
// FUNÇÃO AUXILIAR DE CARREGAMENTO DAS INFORMAÇÕES DA TELA DE DETALHES
// ===============================
async function carregarDetalhes() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  try {
    const brinquedo = await buscarBrinquedoPorId(id);
    renderizarDetalhes(brinquedo);
  } catch (erro) {
    console.error("Erro ao carregar detalhes:", erro);
  }
}

// ===============================
// FUNÇÃO AUXILIAR PARA CARREGAR OS COMPONENTES HTML
// ===============================

async function loadComponent(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

// ===============================
// CARREGAR HEADER E FOOTER
// ===============================

async function carregarLayout() {
  // Função pede o ID do elemento e o arquivo html dela
  await loadComponent("header", "components/header.html");
  await loadComponent("footer", "components/footer.html");
}

// ===============================
// PEGAR PARÂMETRO DA URL PARA BUSCA FUNCIONAR EM QUALQUER PÁGINA
// ===============================

function pegarParametroBusca() {
  const params = new URLSearchParams(window.location.search);
  return params.get("search");
}

// ===============================
// FUNÇÕES DE CARREGAMENTO DA PÁGINA
// ===============================

// Carregar os cards de categoria
async function carregarCategorias() {
  //Carrega dentro da função para não dar erro
  const categoriesContainer = getEl("#categories-carousel");
  if (!categoriesContainer) return;

  const categorias = await buscarCategorias();
  renderizarCategorias(categoriesContainer, categorias, filtrarPorCategoria);
}

// Carregar os cards de marca
async function carregarMarcas() {
  const brandsContainer = getEl("#brands-carousel");
  if (!brandsContainer) return;

  const marcas = await buscarMarcas();

  renderizarMarcas(brandsContainer, marcas, filtrarPorMarca);

  iniciarCarrosselMarcas();
}

//Carregar os cards de brinquedos
const tamanhoPagina = 16; //Varíavel de quantos brinquedos aparecem na página

async function carregarBrinquedos(page = 0) {
  const productsContainer = getEl("#products-wrapper");
  if (!productsContainer) return;

  const resposta = await filtrarBrinquedos({
    categorias: filtros.categorias,
    marcas: filtros.marcas,
    page: page,
    size: tamanhoPagina,
    ordenacao,
  });

  if (!resposta || !resposta.content) {
    console.error("Resposta inválida:", resposta);
    return;
  }

  const brinquedos = resposta.content;

  renderizarBrinquedos(productsContainer, brinquedos);

  const paginacaoContainer = getEl("#pagination-container");
  if (!paginacaoContainer) return;

  renderizarPaginacao(paginacaoContainer, resposta, (novaPagina) => {
    carregarBrinquedos(novaPagina);
  });
}

// ===============================
// FUNÇÕES DE CARREGAMENTO DOS FILTROS
// ===============================

// Carregar os filtros de categoria
async function carregarCategoriasFiltro() {
  const filtroCategoriasContainer = getEl("#categories-filter");
  if (!filtroCategoriasContainer) return;

  const categorias = await buscarCategorias();

  renderizarFiltroCategorias(
    filtroCategoriasContainer,
    categorias,
    alterarCategoria,
  );
}

// Carregar os filtros de marca
async function carregarMarcasFiltro() {
  const filtroMarcasContainer = getEl("#brands-filter");
  if (!filtroMarcasContainer) return;

  const marcas = await buscarMarcas();

  renderizarFiltroMarcas(filtroMarcasContainer, marcas, alterarMarca);
}

// Função que atualiza os filtros
function atualizarFiltros(tipo, id, marcado) {
  if (tipo === "categoria") {
    if (marcado) {
      filtros.categorias.push(id);
    } else {
      filtros.categorias = filtros.categorias.filter((c) => c !== id);
    }
  }

  if (tipo === "marca") {
    if (marcado) {
      filtros.marcas.push(id);
    } else {
      filtros.marcas = filtros.marcas.filter((m) => m !== id);
    }
  }

  carregarBrinquedos(0); // recarrega com paginação + filtro + ordenação
}

// ===============================
// INICIALIZAÇÃO DA PÁGINA
// ===============================

// Função auxiliar de inicialização isolada de cada coisa (Nome para erro e função que vai ser carregada)
function init(nome, fn) {
  try {
    const result = fn();

    // Caso seja async
    if (result instanceof Promise) {
      result.catch((err) => {
        console.error(`Erro em ${nome}:`, err);
      });
    }
  } catch (err) {
    console.error(`Erro em ${nome}:`, err);
  }
}

// Função auxiliar da inicialização dos componentes
async function iniciarPagina() {
  init("categorias", carregarCategorias);
  init("marcas", carregarMarcas);
  init("filtroCategorias", carregarCategoriasFiltro);
  init("filtroMarcas", carregarMarcasFiltro);
}

// ===============================
// START PRINCIPAL
// ===============================

async function start() {
  const input = getEl("#search-input");

  //Componentes Modularizados
  await carregarLayout();

  // Caso esteja na pagina de detalhes
  const isDetalhesPage = window.location.pathname.includes(
    "detalhes_brinquedo.html",
  );

  if (isDetalhesPage) {
    await carregarDetalhes();
    return;
  }

  //Busca ativa após ter os componentes
  iniciarBusca();

  const busca = pegarParametroBusca();

  // Sempre carrega estrutura (SEM produtos ainda)
  await iniciarPagina();

  if (busca) {
    // Se veio com ?search=
    await executarBusca(busca);

    //Preench input
    if (input) input.value = busca;
  } else {
    // Comportamento normal
    await carregarBrinquedos();
  }

  // Carregar o filtro de ordenação
  const ordenacaoSelect = document.getElementById("ordenacao-select");

  if (ordenacaoSelect) {
    ordenacaoSelect.addEventListener("change", (e) => {
      ordenacao = e.target.value;
      carregarBrinquedos(0); // volta para a primeira página
    });
  }

  // Registrar o callback
  setAtualizarFiltrosCallback(atualizarFiltros);
}

//Inicialização
start();
