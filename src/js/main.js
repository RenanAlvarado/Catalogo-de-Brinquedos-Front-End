// ===============================
// IMPORTS
// ===============================

import { inicializarHeaderUsuario } from "./components/header.js";

import { controlarFab } from "./components/fab.js";

import { iniciarHome } from "./pages/homepage.js";

import { iniciarPaginaAdicionarBrinquedo } from "./pages/adicionarBrinquedo.js";

import { iniciarPaginaAdicionarCategoria } from "./pages/adicionarCategoria.js";

import { iniciarPaginaAdicionarMarca } from "./pages/adicionarMarca.js";

import { iniciarTelaCarrinho } from "./pages/carrinho.js";

import { iniciarPaginaPerfil } from "./pages/perfil.js";

import { iniciarPaginaDetalhes } from "./pages/detalhesBrinquedo.js";

import { iniciarBusca, executarBusca } from "./search.js";

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
// START PRINCIPAL
// ===============================

async function start() {
  const input = getEl("#search-input");

  //Componentes Modularizados
  await carregarLayout();

  inicializarHeaderUsuario();

  controlarFab();

  // Caso esteja na pagina de perfil
  const isPerfilPage = window.location.pathname.includes("perfil.html");

  if (isPerfilPage) {
    iniciarPaginaPerfil();
  }

  // Caso esteja na pagina de detalhes
  const isDetalhesPage = window.location.pathname.includes(
    "detalhes_brinquedo.html",
  );

  if (isDetalhesPage) {
    iniciarPaginaDetalhes();
  }

  // Se esta na página de adicionar brinquedo
  const isAddBrinquedoPage = window.location.pathname.includes(
    "adicionar_brinquedo.html",
  );

  if (isAddBrinquedoPage) {
    iniciarPaginaAdicionarBrinquedo();
  }

  // Se esta na página de adicionar categoria
  const isAddCategoriaPage = window.location.pathname.includes(
    "adicionar_categoria.html",
  );

  if (isAddCategoriaPage) {
    iniciarPaginaAdicionarCategoria();
  }

  // Se esta na página de carrinho
  const isCarrinhoPage = window.location.pathname.includes("carrinho.html");

  if (isCarrinhoPage) {
    iniciarTelaCarrinho();
  }

  // Se esta na página de adicionar marca
  const isAddMarcaPage = window.location.pathname.includes(
    "adicionar_marca.html",
  );

  if (isAddMarcaPage) {
    iniciarPaginaAdicionarMarca();
  }

  //Busca ativa após ter os componentes
  iniciarBusca();

  const busca = pegarParametroBusca();

  const isHome =
    window.location.pathname === "/" ||
    window.location.pathname.includes("index.html");

  if (isHome) {
    await iniciarHome();
  }
}

//Inicialização
start();
