// ===============================
// IMPORTS
// ===============================
import { buscarBrinquedosPorNome, buscarMarcasPorNome } from "./api.js";

// ===============================
// INICIAR BUSCA
// ===============================
export function iniciarBusca() {
  let sugestaoSelecionada = -1;
  let itensSugestao = [];

  const searchInput = document.querySelector("#search-input");
  const suggestionsBox = document.querySelector("#suggestions-box");
  const buscaNavbar = document.querySelector("#busca-navbar");
  const formBusca = document.querySelector("#busca-navbar form");

  if (!searchInput) return;

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

    sugestaoSelecionada = -1;
    itensSugestao = [];
  }

  function renderSelecao() {
    const items = suggestionsBox.querySelectorAll(".suggestion-item");

    items.forEach((el, index) => {
      el.classList.toggle("selected", index === sugestaoSelecionada);
    });

    if (items[sugestaoSelecionada]) {
      items[sugestaoSelecionada].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }

  function preencherInput(texto) {
    searchInput.value = texto;
  }

  // ===============================
  // MOSTRAR SUGESTÕES
  // ===============================
  function mostrarSugestoes(brinquedos, marcas) {
    sugestaoSelecionada = -1;
    itensSugestao = [];
    suggestionsBox.innerHTML = "";

    const temMarcas = marcas?.length > 0;
    const temBrinquedos = brinquedos?.length > 0;

    if (!temMarcas && !temBrinquedos) {
      fecharSugestoes();
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

        item.addEventListener("click", () => {
          preencherInput(marca.nome);
          selecionarMarca(marca.id);
        });

        itensSugestao.push({
          tipo: "marca",
          id: marca.id,
          nome: marca.nome,
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
        item.innerHTML = destacarTexto(brinquedo.nome, valor);

        item.addEventListener("click", () => {
          preencherInput(brinquedo.nome);
          executarBusca(brinquedo.nome);
          fecharSugestoes();
        });

        itensSugestao.push({
          tipo: "brinquedo",
          nome: brinquedo.nome,
        });

        suggestionsBox.appendChild(item);
      });
    }

    suggestionsBox.style.display = "block";
    buscaNavbar.classList.add("active");

    renderSelecao();
  }

  // ===============================
  // INPUT (SUGESTÕES)
  // ===============================
  let debounce;

  searchInput.addEventListener("input", async () => {
    const valor = searchInput.value.trim();

    clearTimeout(debounce);

    if (!valor) {
      fecharSugestoes();
      window.dispatchEvent(new Event("filtrosAtualizados"));
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
  // TECLADO
  // ===============================
  // ===============================
  // TECLADO (SETAS SIMPLES - ESTILO ANTIGO)
  // ===============================
  searchInput.addEventListener("keydown", (e) => {
    const total = itensSugestao.length;

    if (!total) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();

      sugestaoSelecionada++;

      if (sugestaoSelecionada >= total) {
        sugestaoSelecionada = 0;
      }

      renderSelecao();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      sugestaoSelecionada--;

      if (sugestaoSelecionada < 0) {
        sugestaoSelecionada = total - 1;
      }

      renderSelecao();
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const item = itensSugestao[sugestaoSelecionada];

      if (!item) return;

      if (item.tipo === "marca") {
        preencherInput(item.nome);
        selecionarMarca(item.id);
      } else {
        preencherInput(item.nome);
        executarBusca(item.nome);
      }

      fecharSugestoes();
    }

    if (e.key === "Escape") {
      fecharSugestoes();
    }
  });

  // ===============================
  // SUBMIT
  // ===============================
  formBusca.addEventListener("submit", (e) => {
    e.preventDefault();

    const valor = searchInput.value.trim();
    if (!valor) return;

    executarBusca(valor);
    fecharSugestoes();
  });

  // ===============================
  // CLICK FORA
  // ===============================
  document.addEventListener("click", (e) => {
    if (!buscaNavbar.contains(e.target)) {
      fecharSugestoes();
    }
  });
}

// ===============================
// BUSCA REAL
// ===============================
export function executarBusca(valor) {
  const params = new URLSearchParams(window.location.search);

  if (valor) params.set("search", valor);
  else params.delete("search");

  params.set("page", 0);

  window.history.pushState({}, "", `?${params.toString()}`);
  window.dispatchEvent(new Event("filtrosAtualizados"));
}
