// ===============================
// IMPORTS
// ===============================

import { aplicarMascaraCEP } from "./utils/masks.js";

import { cepValido } from "./utils/validators.js";

import {
  buscarCategorias,
  buscarMarcas,
  filtrarBrinquedos,
  buscarBrinquedoPorId,
  buscarCEP,
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
// FUNÇÃO AUXILIAR DE CARREGAMENTO DAS INFORMAÇÕES DO CEP NA TELA DE DETALHES
// ===============================
function preencherDadosCepDetalhes(dados) {
  const cepPrice = document.querySelector("#price-span");
  const cepTime = document.querySelector("#cep-time span");
  const cepCode = document.querySelector("#cep-span");

  if (cepCode) {
    cepCode.textContent = dados.cep;
  }

  if (cepPrice) {
    cepPrice.textContent = "R$ 20,90";
  }

  if (cepTime) {
    cepTime.textContent = "3 a 5";
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
// FUNÇÃO AUXILIAR PARA INICIAR A MÁSCARA E VALIDAÇÃO DOS CAMPOS
// ===============================
function iniciarCepDetalhes() {
  const cepInput = getEl("#cep-input");

  const cepInfoDiv = getEl("#cep-info-div");

  const cepErrorDiv = getEl("#cep-error");

  if (!cepInput) return;

  cepInput.addEventListener("input", async (e) => {
    const valor = aplicarMascaraCEP(e.target.value);
    e.target.value = valor;

    //  quando estiver completo
    if (cepValido(valor)) {
      try {
        const dados = await buscarCEP(valor);

        preencherDadosCepDetalhes(dados);

        cepInfoDiv.classList.remove("hide");
        cepErrorDiv.classList.add("hide");
      } catch (erro) {
        console.error("Erro ao buscar CEP:", erro);
      }
    } else if (valor.length === 0) {
      cepErrorDiv.classList.add("hide");
    } else {
      cepInfoDiv.classList.add("hide");
      cepErrorDiv.classList.remove("hide");
    }
  });
}

function iniciarCepPerfil() {
  const cepInput = getEl("#cep-input");
  const cepErrorDiv = getEl("#cep-error");

  const enderecoInput = getEl("#endereco");
  const bairroInput = getEl("#bairro");

  const cidadeSelect = getEl("#city-select");
  const estadoSelect = getEl("#state-select");

  if (!cepInput) return;

  cepInput.addEventListener("input", async (e) => {
    const valor = aplicarMascaraCEP(e.target.value);
    e.target.value = valor;

    //  quando estiver completo
    if (cepValido(valor)) {
      try {
        const dados = await buscarCEP(valor);

        enderecoInput.value = dados.logradouro;
        bairroInput.value = dados.bairro;

        cidadeSelect.innerHTML = `<option>${dados.localidade}</option>`;
        estadoSelect.innerHTML = `<option>${dados.uf}</option>`;
        cepErrorDiv.classList.add("hide");
      } catch (erro) {
        console.error("Erro ao buscar CEP:", erro);
      }
    } else if (valor.length === 0) {
      cepErrorDiv.classList.add("hide");

      enderecoInput.value = "";
      bairroInput.value = "";

      cidadeSelect.innerHTML = `<option>Selecione</option>`;
      estadoSelect.innerHTML = `<option>Selecione</option>`;
    } else {
      cepErrorDiv.classList.remove("hide");

      enderecoInput.value = "";
      bairroInput.value = "";

      cidadeSelect.innerHTML = `<option>Selecione</option>`;
      estadoSelect.innerHTML = `<option>Selecione</option>`;
    }
  });
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

  // Caso esteja na pagina de perfil
  const isPerfilPage = window.location.pathname.includes("perfil.html");

  if (isPerfilPage) {
    iniciarCepPerfil();
  }

  // Caso esteja na pagina de detalhes
  const isDetalhesPage = window.location.pathname.includes(
    "detalhes_brinquedo.html",
  );

  if (isDetalhesPage) {
    await carregarDetalhes();

    // Funcionamento do campo de cep na tela de detalhes
    iniciarCepDetalhes();
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
