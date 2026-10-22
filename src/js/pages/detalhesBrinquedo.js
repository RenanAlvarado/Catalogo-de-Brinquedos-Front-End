// ===============================
// IMPORTS
// ===============================

import { buscarBrinquedoPorId } from "../api.js";
import { renderizarDetalhes } from "../render.js";
import { aplicarMascaraCEP } from "../utils/masks.js";
import { cepValido } from "../utils/validators.js";
import { buscarCEP } from "../api.js";
import { adicionarAoCarrinho } from "../services/cartService.js";
import { atualizarTextoCarrinho } from "../components/header.js";

// ===============================
// FUNÇÃO PRINCIPAL
// ===============================

export async function iniciarPaginaDetalhes() {
  await carregarDetalhes();
  iniciarCep();
}

async function carregarDetalhes() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  try {
    const brinquedo = await buscarBrinquedoPorId(id);
    renderizarDetalhes(brinquedo);

    iniciarBotaoCarrinho(brinquedo);
  } catch (erro) {
    console.error("Erro ao carregar detalhes:", erro);
  }
}

function iniciarCep() {
  const cepInput = document.getElementById("cep-input");
  if (!cepInput) return;

  const cepErrorDiv = document.getElementById("cep-error");

  const cepInfoDiv = document.getElementById("cep-info-div");
  const cepPrice = document.querySelector("#price-span");
  const cepTime = document.querySelector("#cep-time span");
  const cepCode = document.querySelector("#cep-span");

  const cepAddressDiv = document.getElementById("cep-address");
  const addressSpan = document.getElementById("address-span");

  cepInput.addEventListener("input", async (e) => {
    const valor = aplicarMascaraCEP(e.target.value);
    e.target.value = valor;

    if (cepValido(valor)) {
      try {
        const dados = await buscarCEP(valor);

        // CEP digitado
        if (cepCode) {
          cepCode.textContent = dados.cep;
        }

        // Frete fake (por enquanto)
        if (cepPrice) {
          cepPrice.textContent = "R$ 20,90";
        }

        if (cepTime) {
          cepTime.textContent = "3 a 5";
        }

        // Endereço formatado
        if (addressSpan && cepAddressDiv) {
          const endereco = `${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}`;

          addressSpan.textContent = endereco;
          cepAddressDiv.classList.remove("hide");
        }

        cepInfoDiv.classList.remove("hide");
        cepErrorDiv.classList.add("hide");
      } catch (erro) {
        console.error("Erro ao buscar CEP:", erro);
      }
    } else if (valor.length === 0) {
      cepErrorDiv.classList.add("hide");
      cepInfoDiv.classList.add("hide");
    } else {
      cepErrorDiv.classList.remove("hide");
      cepInfoDiv.classList.add("hide");
    }
  });
}

function iniciarBotaoCarrinho(brinquedo) {
  const botao = document.querySelector("#adicionar-carrinho-btn");

  if (!botao) return;

  botao.addEventListener("click", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // 🔒 BLOQUEIO DE LOGIN
    if (!usuario) {
      window.location.href = "login.html";
      return;
    }

    adicionarAoCarrinho(brinquedo);

    atualizarTextoCarrinho();

    botao.innerHTML = "Adicionado ✔";
    botao.disabled = true;

    setTimeout(() => {
      botao.innerHTML =
        "Adicionar ao Carrinho <i class='fa-solid fa-cart-shopping'></i>";
      botao.disabled = false;
    }, 1200);
  });
}
