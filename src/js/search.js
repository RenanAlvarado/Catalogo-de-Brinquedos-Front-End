// ===============================
// IMPORTS
// ===============================
import {
  buscarBrinquedos,
  buscarBrinquedosPorNome,
  buscarMarcasPorNome,
} from "./api.js";

import { filtrarPorMarca } from "./filters.js";
import { renderizarBrinquedos, renderizarMarcas } from "./render.js";

// ===============================
// ESTADO GLOBAL
// ===============================
let modoBuscaAtivo = false;

// ===============================
// URL STATE (FONTE ÚNICA DE VERDADE)
// ===============================
function atualizarURL(params) {
  const url = new URL(window.location);

  Object.entries(params).forEach(([key, value]) => {
    if (!value) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  });

  window.history.pushState({}, "", url);
}

// ===============================
// INIT SEARCH
// ===============================
export function iniciarBusca() {
  let sugestaoSelecionada = -1;

  const searchInput = document.querySelector("#search-input");
  const suggestionsBox = document.querySelector("#suggestions-box");
  const buscaNavbar = document.querySelector("#busca-navbar");
  const formBusca = document.querySelector("#busca-navbar form");

  const productsContainer = document.querySelector("#products-wrapper");
  const categoriesContainer = document.querySelector("#categories-container");
  const brandsContainer = document.querySelector("#brands-container");
  const brandsSection = document.querySelector("#brands-simple-container");
  const brandsCarousel = document.querySelector("#brands-simple-carousel");
  const toysTitle = document.querySelector("#toysContainer-title");
  const mainContainer = document.querySelector("#main-container");

  if (!searchInput) return;

  const estaNaHome = productsContainer && toysTitle;
  const tituloOriginal = toysTitle?.innerText ?? "";

  // ===============================
  // UTIL
  // ===============================
  function destacarTexto(texto, busca) {
    if (!busca) return texto;
    const regex = new RegExp(`(${busca})`, "gi");
    return texto.replace(regex, "<strong>$1</strong>");
  }

  function fecharSugestoes() {
    suggestionsBox.style.display = "none";
    buscaNavbar.classList.remove("active");
  }

  // ===============================
  // MOSTRAR SUGESTÕES
  // ===============================
  function mostrarSugestoes(brinquedos, marcas) {
    sugestaoSelecionada = -1;
    suggestionsBox.innerHTML = "";

    const temBrinquedos = brinquedos?.length > 0;
    const temMarcas = marcas?.length > 0;

    if (!temBrinquedos && !temMarcas) {
      suggestionsBox.style.display = "none";
      buscaNavbar.classList.remove("active");
      return;
    }

    const valor = searchInput.value.trim();

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
        item.innerHTML = destacarTexto(marca.nome, valor);

        item.addEventListener("click", async () => {
          searchInput.value = marca.nome;
          fecharSugestoes();

          modoBuscaAtivo = true;

          atualizarURL({
            marca: marca.id,
            search: marca.nome,
          });

          await executarBuscaPorMarca(marca.id, marca.nome);
        });

        suggestionsBox.appendChild(item);
      });
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
        item.innerHTML = destacarTexto(brinquedo.nome, valor);

        item.addEventListener("click", async () => {
          searchInput.value = brinquedo.nome;
          fecharSugestoes();

          modoBuscaAtivo = true;

          atualizarURL({
            search: brinquedo.nome,
          });

          await executarBusca(brinquedo.nome);
        });

        suggestionsBox.appendChild(item);
      });
    }

    suggestionsBox.style.display = "block";
    buscaNavbar.classList.add("active");
  }

  // ===============================
  // INPUT SEARCH
  // ===============================
  let debounce;

  searchInput.addEventListener("input", async () => {
    const valor = searchInput.value.trim();

    clearTimeout(debounce);

    if (!valor) {
      fecharSugestoes();

      if (estaNaHome && !modoBuscaAtivo) {
        restaurarCatalogo();
      }

      return;
    }

    debounce = setTimeout(async () => {
      const [resB, resM] = await Promise.all([
        buscarBrinquedosPorNome(valor),
        buscarMarcasPorNome(valor),
      ]);

      mostrarSugestoes(
        resB?.content ?? resB ?? [],
        resM?.content ?? resM ?? [],
      );
    }, 200);
  });

  // ===============================
  // ENTER
  // ===============================
  formBusca.addEventListener("submit", async (e) => {
    e.preventDefault();

    const valor = searchInput.value.trim();
    if (!valor) return;

    fecharSugestoes();
    modoBuscaAtivo = true;

    atualizarURL({ search: valor });

    await executarBusca(valor);
  });

  // ===============================
  // CLICK FORA
  // ===============================
  document.addEventListener("click", (e) => {
    if (!buscaNavbar.contains(e.target)) {
      fecharSugestoes();
    }
  });

  // ===============================
  // RESTAURAR CATÁLOGO
  // ===============================
  async function restaurarCatalogo() {
    if (!estaNaHome) return;

    modoBuscaAtivo = false;

    atualizarURL({ search: "", marca: "" });

    if (categoriesContainer) categoriesContainer.style.display = "";
    if (brandsContainer) brandsContainer.style.display = "";
    if (brandsSection) brandsSection.style.display = "none";

    toysTitle.innerText = tituloOriginal;

    const resposta = await buscarBrinquedos();
    renderizarBrinquedos(productsContainer, resposta.content ?? resposta);
  }

  // ===============================
  // BUSCA POR MARCA
  // ===============================
  async function executarBuscaPorMarca(id, nome) {
    await filtrarPorMarca(id, nome);

    modoBuscaAtivo = true;

    if (categoriesContainer) categoriesContainer.style.display = "none";
    if (brandsContainer) brandsContainer.style.display = "none";

    const res = await buscarMarcasPorNome(nome);
    const marcas = res?.content ?? res ?? [];

    if (brandsSection && brandsCarousel) {
      brandsSection.style.display = marcas.length ? "flex" : "none";

      if (marcas.length) {
        brandsCarousel.innerHTML = "";
        renderizarMarcas(brandsCarousel, marcas, filtrarPorMarca);
      }
    }
  }

  // ===============================
  // BUSCA PRINCIPAL
  // ===============================
  async function executarBusca(valor) {
    const [resB, resM] = await Promise.all([
      buscarBrinquedosPorNome(valor),
      buscarMarcasPorNome(valor),
    ]);

    const brinquedos = resB?.content ?? resB ?? [];
    const marcas = resM?.content ?? resM ?? [];

    atualizarTela(valor, brinquedos, marcas);
  }

  // ===============================
  // ATUALIZAR TELA
  // ===============================
  function atualizarTela(valor, brinquedos, marcas) {
    if (!productsContainer || !toysTitle) return;

    modoBuscaAtivo = true;

    if (categoriesContainer) categoriesContainer.style.display = "none";
    if (brandsContainer) brandsContainer.style.display = "none";

    toysTitle.innerText =
      brinquedos.length === 0 && marcas.length === 0
        ? `Nenhum resultado para: "${valor}"`
        : `Resultados para: ${valor}`;

    if (brandsSection && brandsCarousel) {
      if (marcas.length > 0) {
        brandsSection.style.display = "flex";
        brandsCarousel.innerHTML = "";
        renderizarMarcas(brandsCarousel, marcas, filtrarPorMarca);
      } else {
        brandsSection.style.display = "none";
      }
    }

    renderizarBrinquedos(productsContainer, brinquedos);

    if (!document.querySelector("#return-index-btn")) {
      const link = document.createElement("a");
      link.href = "index.html";

      const button = document.createElement("button");
      button.classList.add("btn");
      button.id = "return-index-btn";
      button.textContent = "Voltar ao Menu Principal";

      link.appendChild(button);
      mainContainer?.prepend(link);
    }
  }
}

// ===============================
// EXPORT EXTERNO (opcional)
// ===============================
export async function executarBusca(valor) {
  const [resB, resM] = await Promise.all([
    buscarBrinquedosPorNome(valor),
    buscarMarcasPorNome(valor),
  ]);

  const brinquedos = resB?.content ?? resB ?? [];
  const marcas = resM?.content ?? resM ?? [];

  const productsContainer = document.querySelector("#products-wrapper");
  const toysTitle = document.querySelector("#toysContainer-title");

  if (!productsContainer || !toysTitle) return;

  toysTitle.innerText =
    brinquedos.length === 0 && marcas.length === 0
      ? `Nenhum resultado para: "${valor}"`
      : `Resultados para: ${valor}`;

  renderizarBrinquedos(productsContainer, brinquedos);
}
