import {
  getCarrinho,
  removerDoCarrinho,
  alterarQuantidade,
} from "../services/cartService.js";

import { renderizarCarrinho } from "../render.js";

import { atualizarTextoCarrinho } from "../components/header.js";

// ===============================
// INICIALIZAÇÃO DA TELA
// ===============================

export function iniciarTelaCarrinho() {
  atualizarTela();
  initEventosCarrinho();
}

// ===============================
// RENDER
// ===============================

function atualizarTela() {
  const carrinho = getCarrinho();
  renderizarCarrinho(carrinho);
}

// ===============================
// EVENTOS
// ===============================

function initEventosCarrinho() {
  document.addEventListener("click", (e) => {
    // pega o botão correto mesmo se clicar no ícone
    const removeBtn = e.target.closest(".remove-btn");
    const plusBtn = e.target.closest(".plus");
    const minusBtn = e.target.closest(".minus");

    if (removeBtn) {
      const id = removeBtn.dataset.id;
      removerDoCarrinho(id);
      atualizarTextoCarrinho();
      atualizarTela();
      return;
    }

    if (plusBtn) {
      const id = plusBtn.dataset.id;
      alterarQuantidade(id, 1);
      atualizarTextoCarrinho();
      atualizarTela();

      return;
    }

    if (minusBtn) {
      const id = minusBtn.dataset.id;
      alterarQuantidade(id, -1);
      atualizarTextoCarrinho();
      atualizarTela();
      return;
    }
  });
}
