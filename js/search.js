// ===============================
// IMPORTS
// ===============================

import { buscarBrinquedosPorNome } from "./api.js";
import { renderizarBrinquedos } from "./render.js";

// ===============================
// ELEMENTOS
// ===============================

const searchInput = document.querySelector("#search-input");
const suggestionsBox = document.querySelector("#suggestions-box");
const buscaNavbar = document.querySelector("#busca-navbar");
const formBusca = document.querySelector("#busca-navbar form");

const productsContainer = document.querySelector("#products-wrapper");

// ELEMENTOS QUE VÃO SUMIR
const categoriesContainer = document.querySelector("#categories-container");
const bannerContainer = document.querySelector("#banner-container");
const brandsContainer = document.querySelector("#brands-container");
const toysTitle = document.querySelector("#toys-container h2");

// ===============================
// MOSTRAR SUGESTÕES
// ===============================

function mostrarSugestoes(brinquedos) {
  suggestionsBox.innerHTML = "";

  if (brinquedos.length === 0) {
    suggestionsBox.style.display = "none";
    buscaNavbar.classList.remove("active");
    return;
  }

  brinquedos.forEach((brinquedo) => {
    const item = document.createElement("div");

    item.classList.add("suggestion-item");
    item.textContent = brinquedo.nome;

    item.addEventListener("click", async () => {
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

// ===============================
// EVENTO DE DIGITAÇÃO
// ===============================

searchInput.addEventListener("input", async () => {
  const valor = searchInput.value.trim();

  if (valor.length < 1) {
    suggestionsBox.style.display = "none";
    buscaNavbar.classList.remove("active");
    return;
  }

  const brinquedos = await buscarBrinquedosPorNome(valor);

  mostrarSugestoes(brinquedos);
});

// ===============================
// SUBMIT DO FORM (ENTER / BOTÃO)
// ===============================

formBusca.addEventListener("submit", async (e) => {
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
