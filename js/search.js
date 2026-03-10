// ===============================
// IMPORTS
// ===============================

import {
  buscarBrinquedos,
  buscarBrinquedosPorNome,
  buscarBrinquedosPorCategoria,
} from "./api.js";

import { renderizarBrinquedos } from "./render.js";

// ===============================
// ELEMENTOS
// ===============================

let sugestaoSelecionada = -1;

const searchInput = document.querySelector("#search-input");
const suggestionsBox = document.querySelector("#suggestions-box");
const buscaNavbar = document.querySelector("#busca-navbar");
const formBusca = document.querySelector("#busca-navbar form");

const productsContainer = document.querySelector("#products-wrapper");

// ELEMENTOS QUE SOMEM NA BUSCA
const categoriesContainer = document.querySelector("#categories-container");
const bannerContainer = document.querySelector("#banner-container");
const brandsContainer = document.querySelector("#brands-container");
const toysTitle = document.querySelector("#toys-container h2");

// guardar título original
const tituloOriginal = toysTitle.innerText;

// ===============================
// Detacar texto Buscado
// ===============================

function destacarTexto(texto, busca) {
  const regex = new RegExp(`(${busca})`, "gi");
  return texto.replace(regex, "<strong>$1</strong>");
}

// ===============================
// MOSTRAR SUGESTÕES
// ===============================

function mostrarSugestoes(brinquedos) {
  sugestaoSelecionada = -1;

  suggestionsBox.innerHTML = "";

  if (brinquedos.length === 0) {
    suggestionsBox.style.display = "none";
    buscaNavbar.classList.remove("active");
    return;
  }

  brinquedos.forEach((brinquedo) => {
    const item = document.createElement("div");

    item.classList.add("suggestion-item");
    item.innerHTML = destacarTexto(brinquedo.nome, searchInput.value);

    item.addEventListener("click", () => {
      searchInput.value = brinquedo.nome;

      suggestionsBox.style.display = "none";
      buscaNavbar.classList.remove("active");

      executarBusca(brinquedo.nome);
    });

    suggestionsBox.appendChild(item);
  });

  suggestionsBox.style.display = "block";
  buscaNavbar.classList.add("active");
}

// ===============================
// Sugestão Selecionada
// ===============================

function atualizarSelecao() {
  const itens = document.querySelectorAll(".suggestion-item");

  itens.forEach((item, index) => {
    if (index === sugestaoSelecionada) {
      item.classList.add("selected");

      // Faz o scroll acompanhar o item selecionado
      item.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    } else {
      item.classList.remove("selected");
    }
  });
}

searchInput.addEventListener("keydown", (e) => {
  const itens = document.querySelectorAll(".suggestion-item");

  if (!itens.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();

    sugestaoSelecionada++;

    if (sugestaoSelecionada >= itens.length) {
      sugestaoSelecionada = 0;
    }

    atualizarSelecao();
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();

    sugestaoSelecionada--;

    if (sugestaoSelecionada < 0) {
      sugestaoSelecionada = itens.length - 1;
    }

    atualizarSelecao();
  }

  if (e.key === "Enter") {
    if (sugestaoSelecionada >= 0) {
      e.preventDefault();

      const item = itens[sugestaoSelecionada];

      item.click();
    }
  }
});

// ===============================
// EXECUTAR BUSCA
// ===============================

async function executarBusca(valor) {
  if (!valor) return;

  try {
    const brinquedos = await buscarBrinquedosPorNome(valor);

    mostrarResultadosBusca(valor);

    renderizarBrinquedos(productsContainer, brinquedos);
  } catch (erro) {
    console.error("Erro na busca:", erro);
  }
}

// ===============================
// MOSTRAR RESULTADOS
// ===============================

function mostrarResultadosBusca(valor) {
  categoriesContainer.style.display = "none";
  bannerContainer.style.display = "none";
  brandsContainer.style.display = "none";

  toysTitle.innerText = `Resultados para: "${valor}"`;
}

export async function filtrarPorCategoria(id, nomeCategoria) {
  // 1. Esconde os banners e categorias (reutilizando sua lógica de busca)
  categoriesContainer.style.display = "none";
  bannerContainer.style.display = "none";
  brandsContainer.style.display = "none";

  // 2. Atualiza o título
  toysTitle.innerText = `Categoria: ${nomeCategoria}`;

  try {
    // 3. Busca no back-end
    const brinquedos = await buscarBrinquedosPorCategoria(id);

    // 4. Renderiza os resultados
    renderizarBrinquedos(productsContainer, brinquedos);
  } catch (erro) {
    console.error("Erro ao filtrar categoria:", erro);
  }
}

// ===============================
// RESTAURAR CATÁLOGO
// ===============================

async function restaurarCatalogo() {
  categoriesContainer.style.display = "";
  bannerContainer.style.display = "";
  brandsContainer.style.display = "";

  toysTitle.innerText = tituloOriginal;

  const brinquedos = await buscarBrinquedos();

  renderizarBrinquedos(productsContainer, brinquedos);
}

// ===============================
// EVENTO DE DIGITAÇÃO
// ===============================

searchInput.addEventListener("input", async () => {
  const valor = searchInput.value.trim();

  // voltar ao catálogo
  if (valor.length === 0) {
    suggestionsBox.style.display = "none";
    buscaNavbar.classList.remove("active");

    restaurarCatalogo();
    return;
  }

  const brinquedos = await buscarBrinquedosPorNome(valor);

  mostrarSugestoes(brinquedos);
});

// ===============================
// SUBMIT DO FORM
// ===============================

formBusca.addEventListener("submit", (e) => {
  e.preventDefault();

  const valor = searchInput.value.trim();

  suggestionsBox.style.display = "none";
  buscaNavbar.classList.remove("active");

  executarBusca(valor);
});

// ===============================
// FECHAR SUGESTÕES AO CLICAR FORA
// ===============================

document.addEventListener("click", (e) => {
  if (!buscaNavbar.contains(e.target)) {
    suggestionsBox.style.display = "none";
    buscaNavbar.classList.remove("active");
  }
});
