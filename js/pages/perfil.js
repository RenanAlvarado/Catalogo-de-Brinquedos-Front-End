// ===============================
// IMPORTS
// ===============================

import { buscarUsuarioPorId, buscarCEP } from "../api.js";
import { renderizarPerfil } from "../render.js";

import { aplicarMascaraCEP } from "../utils/masks.js";
import { cepValido } from "../utils/validators.js";

// ===============================
// FUNÇÃO PRINCIPAL DA PÁGINA
// ===============================

export async function iniciarPaginaPerfil() {
  await carregarPerfil();
  iniciarCep();
  iniciarSubmitPerfil();
}

async function carregarPerfil() {
  const usuarioStorage = JSON.parse(localStorage.getItem("usuario"));

  if (!usuarioStorage) {
    window.location.href = "login.html";
    return;
  }

  try {
    const usuario = await buscarUsuarioPorId(usuarioStorage.id);
    renderizarPerfil(usuario);
  } catch (erro) {
    console.error("Erro ao carregar perfil:", erro);
  }
}

function iniciarCep() {
  const cepInput = document.getElementById("cep-input");
  const cepErrorDiv = document.getElementById("cep-error");

  const enderecoInput = document.getElementById("endereco-input");
  const bairroInput = document.getElementById("bairro-input");
  const cidadeSelect = document.getElementById("city-select");
  const estadoSelect = document.getElementById("state-select");

  if (!cepInput) return;

  cepInput.addEventListener("input", async (e) => {
    const valor = aplicarMascaraCEP(e.target.value);
    e.target.value = valor;

    if (cepValido(valor)) {
      try {
        const dados = await buscarCEP(valor);

        enderecoInput.value = dados.logradouro;
        bairroInput.value = dados.bairro;

        cidadeSelect.innerHTML = `<option>${dados.localidade}</option>`;
        estadoSelect.innerHTML = `<option>${dados.uf}</option>`;

        cepErrorDiv.classList.add("hide");
      } catch {
        cepErrorDiv.classList.remove("hide");
      }
    }
  });
}

function iniciarSubmitPerfil() {
  const form = document.getElementById("form-aditional-informations");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    console.log("Salvar perfil depois");
  });
}
