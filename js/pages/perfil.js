// ===============================
// IMPORTS
// ===============================

import { buscarUsuarioPorId, buscarCEP, alterarUsuarioAPI } from "../api.js";
import { renderizarPerfil } from "../render.js";

import { aplicarMascaraCEP } from "../utils/masks.js";
import { aplicarMascaraTelefone } from "../utils/masks.js";
import { removerMascara } from "../utils/masks.js";
import { cepValido } from "../utils/validators.js";
import { campoVazio } from "../utils/validators.js";
import { selectNaoSelecionado } from "../utils/validators.js";

// ===============================
// FUNÇÃO PRINCIPAL DA PÁGINA
// ===============================

export async function iniciarPaginaPerfil() {
  await carregarPerfil();
  iniciarCep();
  iniciarTelefone();
  iniciarLimparFormularioPerfil();
  adicionarRemocaoErroPerfil();
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

// ===============================
// FUNÇÕES DE VALIDAÇÃO
// ===============================
function marcarErro(campo) {
  campo.style.border = "1px solid red";
}

function limparErro(campo) {
  campo.style.border = "1px solid #000";
}

function validarFormularioPerfil() {
  const nome = document.getElementById("nome-input");
  const email = document.getElementById("email-input");
  const telefone = document.getElementById("number-input");
  const cep = document.getElementById("cep-input");
  const numero = document.getElementById("numero-input");

  let valido = true;

  // Nome
  if (campoVazio(nome.value)) {
    marcarErro(nome);
    valido = false;
  } else limparErro(nome);

  // E-mail
  if (campoVazio(email.value)) {
    marcarErro(email);
    valido = false;
  } else limparErro(email);

  // Telefone
  if (campoVazio(telefone.value)) {
    marcarErro(telefone);
    valido = false;
  } else limparErro(telefone);

  // CEP
  if (campoVazio(cep.value) || !cepValido(cep.value)) {
    marcarErro(cep);
    valido = false;
  } else limparErro(cep);

  // Número
  if (campoVazio(numero.value)) {
    marcarErro(numero);
    valido = false;
  } else limparErro(numero);

  return valido;
}

function adicionarRemocaoErroPerfil() {
  const campos = document.querySelectorAll(
    "#nome-input, #email-input, #number-input, #cep-input, #numero-input",
  );

  campos.forEach((campo) => {
    campo.addEventListener("input", () => limparErro(campo));
    campo.addEventListener("change", () => limparErro(campo));
  });
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

function iniciarTelefone() {
  const telefoneInput = document.getElementById("number-input");

  if (!telefoneInput) return;

  telefoneInput.addEventListener("input", (e) => {
    const valor = aplicarMascaraTelefone(e.target.value);
    e.target.value = valor;
  });
}

function iniciarSubmitPerfil() {
  const form = document.getElementById("form-aditional-informations");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validarFormularioPerfil()) return;

    alterarPerfil();
  });
}

async function alterarPerfil() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

  const dados = {
    nome: document.getElementById("nome-input").value,
    email: document.getElementById("email-input").value,
    telefone: removerMascara(document.getElementById("number-input").value),

    endereco: {
      cep: document.getElementById("cep-input").value,
      rua: document.getElementById("endereco-input").value,
      bairro: document.getElementById("bairro-input").value,
      numero: document.getElementById("numero-input").value,
      cidade: document.getElementById("city-select").value,
      estado: document.getElementById("state-select").value,
    },
  };

  try {
    const atualizado = await alterarUsuarioAPI(usuarioLogado.id, dados);

    localStorage.setItem("usuario", JSON.stringify(atualizado));

    alert("Perfil atualizado com sucesso!");
  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar perfil");
  }
}

// ===============================
// LIMPAR FORMULÁRIO
// ===============================

export function iniciarLimparFormularioPerfil() {
  const form = document.getElementById("form-aditional-informations");
  const btnLimpar = document.getElementById("limpar-btn");

  if (!form || !btnLimpar) return;

  btnLimpar.addEventListener("click", (e) => {
    e.preventDefault();

    // limpa apenas os campos do formulário da direita
    form.reset();

    // limpa selects manualmente (porque são dinâmicos)
    const citySelect = document.getElementById("city-select");
    const stateSelect = document.getElementById("state-select");

    if (citySelect) {
      citySelect.innerHTML = "<option>Selecione</option>";
    }

    if (stateSelect) {
      stateSelect.innerHTML = "<option>Selecione</option>";
    }

    // limpa mensagem de erro do CEP
    const cepErrorDiv = document.getElementById("cep-error");
    if (cepErrorDiv) {
      cepErrorDiv.classList.add("hide");
    }
  });
}
