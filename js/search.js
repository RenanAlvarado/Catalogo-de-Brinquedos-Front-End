// ===============================
// IMPORTS
// ===============================

import { buscarBrinquedosPorNome } from "./api.js";

// ===============================
// ELEMENTOS
// ===============================

const searchInput = document.querySelector("#search-input");
const suggestionsBox = document.querySelector("#suggestions-box");
const buscaNavbar = document.querySelector("#busca-navbar");
const formBusca = document.querySelector("#busca-navbar form");

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

    item.addEventListener("click", () => {
      searchInput.value = brinquedo.nome;

      suggestionsBox.style.display = "none";
      buscaNavbar.classList.remove("active");
    });

    suggestionsBox.appendChild(item);
  });

  suggestionsBox.style.display = "block";
  buscaNavbar.classList.add("active");
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
// IMPEDIR SUBMIT DO FORM
// ===============================

formBusca.addEventListener("submit", (e) => {
  e.preventDefault();
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
