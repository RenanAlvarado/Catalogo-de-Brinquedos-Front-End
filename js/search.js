// ===============================
// IMPORTS
// ===============================

import { buscarBrinquedos, buscarBrinquedosPorNome } from "./api.js";
import { renderizarBrinquedos } from "./render.js";

// ===============================
// INICIAR BUSCA
// ===============================

export function iniciarBusca() {
  let sugestaoSelecionada = -1;

  const mainContainer = document.querySelector("#main-container");
  const searchInput = document.querySelector("#search-input");
  const suggestionsBox = document.querySelector("#suggestions-box");
  const buscaNavbar = document.querySelector("#busca-navbar");
  const formBusca = document.querySelector("#busca-navbar form");

  const productsContainer = document.querySelector("#products-wrapper");
  const categoriesContainer = document.querySelector("#categories-container");
  const brandsContainer = document.querySelector("#brands-container");
  const toysTitle = document.querySelector("#toysContainer-title");

  if (!searchInput) return;

  const estaNaHome = productsContainer && toysTitle;
  const tituloOriginal = toysTitle ? toysTitle.innerText : "";

  // ===============================
  // DESTACAR TEXTO
  // ===============================

  function destacarTexto(texto, busca) {
    const regex = new RegExp(`(${busca})`, "gi");
    return texto.replace(regex, "<strong>$1</strong>");
  }

  // ===============================
  // BOTÃO VOLTAR
  // ===============================

  function criarBotaoVoltar() {
    if (!estaNaHome) return;
    if (document.querySelector("#return-index-btn")) return;

    const link = document.createElement("a");
    link.href = "index.html";

    const button = document.createElement("button");
    button.classList.add("btn");
    button.id = "return-index-btn";
    button.textContent = "Voltar ao Menu Principal";

    link.appendChild(button);
    mainContainer.prepend(link);
  }

  function removerBotaoVoltar() {
    const botao = document.querySelector("#return-index-btn");
    if (botao) botao.parentElement.remove();
  }

  // ===============================
  // MOSTRAR SUGESTÕES
  // ===============================

  function mostrarSugestoes(brinquedos) {
    sugestaoSelecionada = -1;
    suggestionsBox.innerHTML = "";

    if (!Array.isArray(brinquedos) || brinquedos.length === 0) {
      suggestionsBox.style.display = "none";
      buscaNavbar.classList.remove("active");
      return;
    }

    brinquedos.forEach((brinquedo) => {
      const item = document.createElement("div");

      item.classList.add("suggestion-item");
      item.innerHTML = destacarTexto(brinquedo.nome, searchInput.value);

      item.addEventListener("click", () => {
        const nome = brinquedo.nome;

        searchInput.value = nome;
        suggestionsBox.style.display = "none";
        buscaNavbar.classList.remove("active");

        if (estaNaHome) {
          executarBusca(nome);
        } else {
          window.location.href = `index.html?search=${encodeURIComponent(nome)}`;
        }
      });

      suggestionsBox.appendChild(item);
    });

    suggestionsBox.style.display = "block";
    buscaNavbar.classList.add("active");
  }

  // ===============================
  // NAVEGAÇÃO COM SETAS
  // ===============================

  function atualizarSelecao() {
    const itens = document.querySelectorAll(".suggestion-item");

    itens.forEach((item, index) => {
      if (index === sugestaoSelecionada) {
        item.classList.add("selected");
        item.scrollIntoView({ block: "nearest" });
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
      sugestaoSelecionada = (sugestaoSelecionada + 1) % itens.length;
      atualizarSelecao();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      sugestaoSelecionada =
        (sugestaoSelecionada - 1 + itens.length) % itens.length;
      atualizarSelecao();
    }

    if (e.key === "Enter" && sugestaoSelecionada >= 0) {
      e.preventDefault();
      itens[sugestaoSelecionada].click();
    }
  });

  // ===============================
  // RESTAURAR CATÁLOGO
  // ===============================

  async function restaurarCatalogo() {
    if (!estaNaHome) return;

    if (categoriesContainer) categoriesContainer.style.display = "";
    if (brandsContainer) brandsContainer.style.display = "";

    toysTitle.innerText = tituloOriginal;
    removerBotaoVoltar();

    const resposta = await buscarBrinquedos();
    const brinquedos = resposta.content || resposta;

    renderizarBrinquedos(productsContainer, brinquedos);
  }

  // ===============================
  // DIGITAÇÃO
  // ===============================

  searchInput.addEventListener("input", async () => {
    const valor = searchInput.value.trim();

    if (valor.length === 0) {
      suggestionsBox.style.display = "none";
      buscaNavbar.classList.remove("active");

      if (estaNaHome) restaurarCatalogo();
      return;
    }

    const resposta = await buscarBrinquedosPorNome(valor);
    const brinquedos = resposta.content || resposta;

    mostrarSugestoes(brinquedos);
  });

  // ===============================
  // SUBMIT
  // ===============================

  formBusca.addEventListener("submit", (e) => {
    e.preventDefault();

    const valor = searchInput.value.trim();
    if (!valor) return;

    suggestionsBox.style.display = "none";
    buscaNavbar.classList.remove("active");

    if (estaNaHome) {
      executarBusca(valor);
    } else {
      window.location.href = `index.html?search=${encodeURIComponent(valor)}`;
    }
  });

  // ===============================
  // CLICK FORA
  // ===============================

  document.addEventListener("click", (e) => {
    if (!buscaNavbar.contains(e.target)) {
      suggestionsBox.style.display = "none";
      buscaNavbar.classList.remove("active");
    }
  });
}

// ===============================
// EXECUTAR BUSCA (GLOBAL)
// ===============================

export async function executarBusca(valor) {
  const productsContainer = document.querySelector("#products-wrapper");
  const toysTitle = document.querySelector("#toysContainer-title");
  const categoriesContainer = document.querySelector("#categories-container");
  const brandsContainer = document.querySelector("#brands-container");
  const mainContainer = document.querySelector("#main-container");

  if (!productsContainer || !toysTitle) return;

  try {
    const resposta = await buscarBrinquedosPorNome(valor);
    const brinquedos = resposta.content || resposta;

    if (categoriesContainer) categoriesContainer.style.display = "none";
    if (brandsContainer) brandsContainer.style.display = "none";

    if (!document.querySelector("#return-index-btn")) {
      const link = document.createElement("a");
      link.href = "index.html";

      const button = document.createElement("button");
      button.classList.add("btn");
      button.id = "return-index-btn";
      button.textContent = "Voltar ao Menu Principal";

      link.appendChild(button);
      mainContainer.prepend(link);
    }

    if (!Array.isArray(brinquedos) || brinquedos.length === 0) {
      toysTitle.innerText = `Nenhum resultado para: "${valor}"`;
    } else {
      toysTitle.innerText = `Resultados para: ${valor}`;
    }

    renderizarBrinquedos(productsContainer, brinquedos);
  } catch (erro) {
    console.error("Erro na busca:", erro);
  }
}
