// ===============================
// IMPORTS
// ===============================

import {
  buscarBrinquedos,
  buscarBrinquedosPorNome,
  buscarMarcasPorNome,
  filtrarBrinquedos,
  buscarBrinquedosPorMarca,
} from "./api.js";

import { filtrarPorMarca } from "./filters.js";

import { renderizarBrinquedos, renderizarMarcas } from "./render.js";

// ===============================
// FUNÇÃO DE INICIAR BUSCA
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
  // MOSTRAR SUGESTÕES
  // ===============================
  function mostrarSugestoes(brinquedos, marcas) {
    sugestaoSelecionada = -1;
    suggestionsBox.innerHTML = "";

    if (
      (!Array.isArray(brinquedos) || brinquedos.length === 0) &&
      (!Array.isArray(marcas) || marcas.length === 0)
    ) {
      suggestionsBox.style.display = "none";
      buscaNavbar.classList.remove("active");
      return;
    }

    const temMarcas = Array.isArray(marcas) && marcas.length > 0;
    const temBrinquedos = Array.isArray(brinquedos) && brinquedos.length > 0;

    // ===============================
    // MARCAS
    // ===============================
    if (temMarcas) {
      const titulo = document.createElement("div");
      titulo.classList.add("suggestion-section-title");
      titulo.textContent = "Marcas";
      suggestionsBox.appendChild(titulo);

      marcas.forEach((marca) => {
        const item = document.createElement("div");

        item.classList.add("suggestion-item");
        item.innerHTML = destacarTexto(marca.nome, searchInput.value);

        item.dataset.id = marca.id;

        item.addEventListener("click", () => {
          const id = marca.id;
          const nome = marca.nome;

          searchInput.value = nome;
          suggestionsBox.style.display = "none";
          buscaNavbar.classList.remove("active");

          if (estaNaHome) {
            executarBuscaPorMarca(id, nome);
          } else {
            window.location.href = `index.html?marca=${id}`;
          }
        });

        suggestionsBox.appendChild(item);
      });
    }

    // ===============================
    // DIVISÓRIA
    // ===============================
    if (temMarcas && temBrinquedos) {
      const divider = document.createElement("div");
      divider.classList.add("suggestion-divider");
      suggestionsBox.appendChild(divider);
    }

    // ===============================
    // BRINQUEDOS
    // ===============================
    if (temBrinquedos) {
      const titulo = document.createElement("div");
      titulo.classList.add("suggestion-section-title");
      titulo.textContent = "Brinquedos";
      suggestionsBox.appendChild(titulo);

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
    }

    suggestionsBox.style.display = "block";
    buscaNavbar.classList.add("active");
  }

  // ===============================
  // INPUT (NÃO MEXI NO COMPORTAMENTO)
  // ===============================
  searchInput.addEventListener("input", async () => {
    const valor = searchInput.value.trim();

    if (valor.length === 0) {
      suggestionsBox.style.display = "none";
      buscaNavbar.classList.remove("active");

      if (estaNaHome) restaurarCatalogo();
      return;
    }

    const [resBrinquedos, resMarcas] = await Promise.all([
      buscarBrinquedosPorNome(valor),
      buscarMarcasPorNome(valor),
    ]);

    const brinquedos = resBrinquedos.content || resBrinquedos;
    const marcas = resMarcas.content || resMarcas;

    mostrarSugestoes(brinquedos, marcas);
  });

  // ===============================
  // ENTER (MANTIDO IGUAL)
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
  // CLICK FORA (MANTIDO)
  // ===============================
  document.addEventListener("click", (e) => {
    if (!buscaNavbar.contains(e.target)) {
      suggestionsBox.style.display = "none";
      buscaNavbar.classList.remove("active");
    }
  });

  // ===============================
  // RESTAURAR CATÁLOGO
  // ===============================
  async function restaurarCatalogo() {
    if (!estaNaHome) return;

    if (categoriesContainer) categoriesContainer.style.display = "";
    if (brandsContainer) brandsContainer.style.display = "";

    const brandsSection = document.querySelector("#brands-simple-container");
    if (brandsSection) brandsSection.style.display = "none";

    toysTitle.innerText = tituloOriginal;

    const resposta = await buscarBrinquedos();
    const brinquedos = resposta.content || resposta;

    renderizarBrinquedos(productsContainer, brinquedos);
  }

  // ===============================
  // BUSCA POR MARCA (NOVO, CORRETO)
  // ===============================
  async function executarBuscaPorMarca(id, nome) {
    await filtrarPorMarca(id, nome);

    const categoriesContainer = document.querySelector("#categories-container");
    const brandsContainer = document.querySelector("#brands-container");

    if (categoriesContainer) categoriesContainer.style.display = "none";
    if (brandsContainer) brandsContainer.style.display = "none";

    const brandsSection = document.querySelector("#brands-simple-container");
    const brandsCarousel = document.querySelector("#brands-simple-carousel");

    if (brandsSection && brandsCarousel) {
      brandsSection.style.display = "flex";

      const marcasFiltradas = await buscarMarcasPorNome(nome);
      const marcas = marcasFiltradas.content || marcasFiltradas;

      brandsCarousel.innerHTML = "";
      renderizarMarcas(brandsCarousel, marcas, filtrarPorMarca);
    }
  }
}

// ===============================
// BUSCA NORMAL
// ===============================
export async function executarBusca(valor) {
  const [resBrinquedos, resMarcas] = await Promise.all([
    buscarBrinquedosPorNome(valor),
    buscarMarcasPorNome(valor),
  ]);

  const brinquedos = resBrinquedos.content || resBrinquedos;
  const marcas = resMarcas.content || resMarcas;

  atualizarResultadoNaTela(valor, brinquedos, marcas);
}

// ===============================
// ATUALIZAR TELA
// ===============================
function atualizarResultadoNaTela(valor, brinquedos, marcas) {
  const productsContainer = document.querySelector("#products-wrapper");
  const toysTitle = document.querySelector("#toysContainer-title");
  const categoriesContainer = document.querySelector("#categories-container");
  const brandsContainer = document.querySelector("#brands-container");
  const mainContainer = document.querySelector("#main-container");

  if (!productsContainer || !toysTitle) return;

  // ===============================
  // ESCONDER FILTROS DA HOME
  // ===============================
  if (categoriesContainer) categoriesContainer.style.display = "none";
  if (brandsContainer) brandsContainer.style.display = "none";

  // ===============================
  // TÍTULO
  // ===============================
  toysTitle.innerText =
    brinquedos.length === 0 && marcas.length === 0
      ? `Nenhum resultado para: "${valor}"`
      : `Resultados para: ${valor}`;

  // ===============================
  // CARROSSEL DE MARCAS (BUSCA)
  // ===============================
  const brandsSection = document.querySelector("#brands-simple-container");
  const brandsCarousel = document.querySelector("#brands-simple-carousel");

  if (brandsSection && brandsCarousel) {
    if (marcas.length > 0) {
      brandsSection.style.display = "flex";
      brandsCarousel.innerHTML = "";

      renderizarMarcas(brandsCarousel, marcas, filtrarPorMarca);
    } else {
      brandsSection.style.display = "none";
    }
  }

  // ===============================
  // BRINQUEDOS
  // ===============================
  renderizarBrinquedos(productsContainer, brinquedos);

  // ===============================
  // BOTÃO VOLTAR (BUSCA TEXTO / SUGESTÃO)
  // ===============================
  const existeBotao = document.querySelector("#return-index-btn");

  if (!existeBotao) {
    const link = document.createElement("a");
    link.href = "index.html";

    const button = document.createElement("button");
    button.classList.add("btn");
    button.id = "return-index-btn";
    button.textContent = "Voltar ao Menu Principal";

    link.appendChild(button);

    mainContainer.prepend(link);
  }
}
