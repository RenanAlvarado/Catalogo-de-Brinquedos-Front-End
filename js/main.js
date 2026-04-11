// ===============================
// IMPORTS
// ===============================

import { aplicarMascaraCEP, aplicarMascaraPreco } from "./utils/masks.js";

import { cepValido } from "./utils/validators.js";

import {
  iniciarUploadImagem,
  carregarMarcasSelect,
  carregarCategoriasSelect,
  iniciarLimparFormulario,
  iniciarValidacaoFormulario,
} from "./adicionarBrinquedo.js";

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
  renderizarAlterarBrinquedo,
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
// FUNÇÃO AUXILIAR DE CARREGAMENTO DAS INFORMAÇÕES DA TELA DE DETALHES
// ===============================
async function carregarAlterarBrinquedos() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  try {
    const brinquedo = await buscarBrinquedoPorId(id);
    renderizarAlterarBrinquedo(brinquedo);
  } catch (erro) {
    console.error("Erro ao carregar detalhes:", erro);
  }
}

// ===============================
// FUNÇÃO AUXILIAR DE CARREGAMENTO DAS INFORMAÇÕES DA TELA DE QUICK VIEW DOS BRINQUEDOS
// ===============================

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

function iniciarCep() {
  const cepInput = getEl("#cep-input");

  if (!cepInput) return;

  const cepErrorDiv = getEl("#cep-error");

  // Variáveis fora de escopo
  let isDetalhesPage = false;

  let cepInfoDiv, cepPrice, cepTime, cepCode;
  let cepAddressDiv, addressSpan;
  let enderecoInput, bairroInput, cidadeSelect, estadoSelect;

  if (window.location.pathname.includes("detalhes_brinquedo.html")) {
    isDetalhesPage = true;

    cepInfoDiv = getEl("#cep-info-div");
    cepPrice = document.querySelector("#price-span");
    cepTime = document.querySelector("#cep-time span");
    cepCode = document.querySelector("#cep-span");

    cepAddressDiv = getEl("#cep-address");
    addressSpan = getEl("#address-span");
  } else if (window.location.pathname.includes("perfil.html")) {
    enderecoInput = getEl("#endereco");
    bairroInput = getEl("#bairro");
    cidadeSelect = getEl("#city-select");
    estadoSelect = getEl("#state-select");
  }

  cepInput.addEventListener("input", async (e) => {
    const valor = aplicarMascaraCEP(e.target.value);
    e.target.value = valor;

    //  quando estiver completo
    if (cepValido(valor)) {
      try {
        const dados = await buscarCEP(valor);

        if (isDetalhesPage) {
          if (cepCode) {
            cepCode.textContent = dados.cep;
          }

          if (cepPrice) {
            cepPrice.textContent = "R$ 20,90";
          }

          if (cepTime) {
            cepTime.textContent = "3 a 5";
          }

          // Montar o endereço bonito
          if (addressSpan && cepAddressDiv) {
            const endereco = `${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}`;

            addressSpan.textContent = endereco;
            cepAddressDiv.classList.remove("hide");
          }

          cepInfoDiv.classList.remove("hide");
          cepErrorDiv.classList.add("hide");
        } else {
          enderecoInput.value = dados.logradouro;
          bairroInput.value = dados.bairro;

          cidadeSelect.innerHTML = `<option>${dados.localidade}</option>`;
          estadoSelect.innerHTML = `<option>${dados.uf}</option>`;
          cepErrorDiv.classList.add("hide");
        }
      } catch (erro) {
        console.error("Erro ao buscar CEP:", erro);
      }
    } else if (valor.length === 0) {
      cepErrorDiv.classList.add("hide");

      if (!isDetalhesPage) {
        enderecoInput.value = "";
        bairroInput.value = "";

        cidadeSelect.innerHTML = `<option>Selecione</option>`;
        estadoSelect.innerHTML = `<option>Selecione</option>`;
      }
    } else {
      cepErrorDiv.classList.remove("hide");

      if (isDetalhesPage) {
        cepInfoDiv.classList.add("hide");
      } else {
        enderecoInput.value = "";
        bairroInput.value = "";

        cidadeSelect.innerHTML = `<option>Selecione</option>`;
        estadoSelect.innerHTML = `<option>Selecione</option>`;
      }
    }
  });
}

function iniciarMascaraPreco() {
  const precoInput = getEl("#preco-input");

  if (!precoInput) return;

  precoInput.addEventListener("input", (e) => {
    e.target.value = aplicarMascaraPreco(e.target.value);
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

  iniciarMascaraPreco();

  iniciarCep();

  iniciarUploadImagem();

  // Caso esteja na pagina de detalhes
  const isDetalhesPage = window.location.pathname.includes(
    "detalhes_brinquedo.html",
  );

  if (isDetalhesPage) {
    await carregarDetalhes();
  }

  // Se esta na página de adicionar
  const isAddPage = window.location.pathname.includes(
    "adicionar_brinquedo.html",
  );

  if (isAddPage) {
    await carregarMarcasSelect();
    await carregarCategoriasSelect();

    await carregarAlterarBrinquedos();

    iniciarLimparFormulario();
    iniciarValidacaoFormulario();
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

// ==========================================
// MOTOR DO CARRINHO DE COMPRAS (LOCALSTORAGE)
// ==========================================

// 1. Função para ler o carrinho salvo no navegador (ou criar um vazio)
function obterCarrinho() {
  const carrinhoSalvo = localStorage.getItem("carrinhoMarah");
  if (carrinhoSalvo) {
    return JSON.parse(carrinhoSalvo);
  } else {
    return [];
  }
}

// 2. Função para salvar as alterações no navegador
function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinhoMarah", JSON.stringify(carrinho));
}

// 3. Função para Adicionar um produto (Vamos chamar essa função lá na tela de Detalhes)
function adicionarAoCarrinho(id, nome, preco, imagem, marca) {
  const carrinho = obterCarrinho();

  // Verifica se o brinquedo já está no carrinho
  const brinquedoExistente = carrinho.find((item) => item.id === id);

  if (brinquedoExistente) {
    brinquedoExistente.quantidade += 1; // Se já tem, só aumenta a quantidade
  } else {
    // Se não tem, adiciona um novo item
    carrinho.push({
      id: id,
      nome: nome,
      preco: preco,
      imagem: imagem,
      marca: marca,
      quantidade: 1,
    });
  }

  salvarCarrinho(carrinho);
  alert(`${nome} foi adicionado ao seu carrinho!`);
}

// 4. Função para desenhar os itens na tela do Carrinho
function renderizarTelaCarrinho() {
  // Verifica se estamos na página do carrinho
  const cartItemsSection = document.getElementById("cart-items-section");
  if (!cartItemsSection) return; // Se não estiver na tela do carrinho, para a função aqui

  const carrinho = obterCarrinho();
  cartItemsSection.innerHTML = ""; // Limpa os exemplos fixos do HTML

  if (carrinho.length === 0) {
    cartItemsSection.innerHTML =
      '<h2 style="text-align: center; color: #888; padding: 40px;">Seu carrinho está vazio 😔</h2>';
    document.querySelector(".summary-line span:last-child").textContent =
      "R$ 0,00";
    document.querySelector(".total-line span:last-child").textContent =
      "R$ 0,00";
    return;
  }

  let subtotal = 0;

  // Desenha cada item salvo no LocalStorage
  carrinho.forEach((item, index) => {
    // Remove o "R$" e converte a string de preço para número para podermos calcular
    const precoNumerico = parseFloat(
      item.preco.replace("R$ ", "").replace(",", "."),
    );
    subtotal += precoNumerico * item.quantidade;

    const itemHTML = `
        <div class="cart-item">
            <img src="${item.imagem}" alt="${item.nome}" class="item-img" />
            <div class="item-info">
                <h3>${item.nome}</h3>
                <p class="item-brand">Marca: ${item.marca}</p>
                <p class="item-price">${item.preco}</p>
            </div>
            <div class="item-actions">
                <div class="quantity-control">
                    <button class="qtd-btn minus" onclick="alterarQuantidade(${index}, -1)">-</button>
                    <input type="text" value="${item.quantidade}" readonly />
                    <button class="qtd-btn plus" onclick="alterarQuantidade(${index}, 1)">+</button>
                </div>
                <button class="remove-btn" title="Remover item" onclick="removerDoCarrinho(${index})">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>
    `;
    cartItemsSection.innerHTML += itemHTML;
  });

  // Atualiza os valores do resumo à direita
  const valorFormatado = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
  document.querySelectorAll(".summary-line span:last-child")[0].textContent =
    valorFormatado;
  document.querySelector(".total-line span:last-child").textContent =
    valorFormatado;
}

// 5. Funções de controle (Botão de +, - e Excluir)
window.alterarQuantidade = function (index, mudanca) {
  const carrinho = obterCarrinho();
  carrinho[index].quantidade += mudanca;

  if (carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1); // Se a quantidade chegar a zero, remove o item
  }

  salvarCarrinho(carrinho);
  renderizarTelaCarrinho();
};

window.removerDoCarrinho = function (index) {
  const carrinho = obterCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  renderizarTelaCarrinho();
};

// Executa a renderização assim que a página carrega
renderizarTelaCarrinho();

//Inicialização
start();
