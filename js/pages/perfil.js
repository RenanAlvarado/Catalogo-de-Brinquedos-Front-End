// ===============================
// IMPORTS
// ===============================

import {
  buscarUsuarioPorId,
  buscarCEP,
  alterarUsuarioAPI,
  atualizarImagemUsuarioAPI,
} from "../api.js";
import { renderizarPerfil } from "../render.js";

import {
  aplicarMascaraCEP,
  removerMascara,
  aplicarMascaraTelefone,
} from "../utils/masks.js";

import { cepValido, campoVazio, telefoneValido } from "../utils/validators.js";

import { confirmarAcao, mostrarFeedbackAcao } from "../utils/modals.js";

// ===============================
// FUNÇÃO PRINCIPAL DA PÁGINA
// ===============================

export async function iniciarPaginaPerfil() {
  await carregarPerfil();
  iniciarCep();
  iniciarTelefone();
  iniciarLimparCep();
  adicionarRemocaoErroPerfil();
  iniciarSubmitPerfil();
  iniciarUploadImagemPerfil();
}

async function carregarPerfil() {
  const usuarioStorage = JSON.parse(localStorage.getItem("usuario"));

  if (!usuarioStorage) {
    window.location.href = "login.html";
    return;
  }

  const cepInput = document.getElementById("cep-input");

  if (usuarioStorage.endereco && usuarioStorage.endereco.cep) {
    cepInput.disabled = true;
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
  campo.style.border = "1px solid #ccc";
}

function validarFormularioPerfil() {
  const nome = document.getElementById("nome-input");
  const nomeInputIcon = document.getElementById("nome-input-icon");
  const telefone = document.getElementById("number-input");
  const telefoneInputIcon = document.getElementById("telefone-input-icon");
  const cep = document.getElementById("cep-input");
  const cepInputIcon = document.getElementById("cep-input-icon");
  const numero = document.getElementById("numero-input");
  const numeroInputIcon = document.getElementById("numero-input-icon");

  let valido = true;

  // Nome (obrigatório)
  if (campoVazio(nome.value)) {
    marcarErro(nomeInputIcon);
    valido = false;
  } else limparErro(nomeInputIcon);

  // Telefone (opcional, mas se tiver valida)
  if (!campoVazio(telefone.value) && !telefoneValido(telefone.value)) {
    marcarErro(telefoneInputIcon);
    alert("Telefone inválido! Verifique o DDD e o número.");
    valido = false;
  } else {
    limparErro(telefoneInputIcon);
  }

  // CEP (só valida se preenchido)
  if (!campoVazio(cep.value) && !cepValido(cep.value)) {
    marcarErro(cepInputIcon);
    valido = false;
  } else {
    limparErro(cepInputIcon);
  }

  // Número (só valida se CEP foi preenchido)
  if (!campoVazio(cep.value) && campoVazio(numero.value)) {
    marcarErro(numeroInputIcon);
    valido = false;
  } else {
    limparErro(numeroInputIcon);
  }

  return valido;
}

function adicionarRemocaoErroPerfil() {
  const campos = document.querySelectorAll(
    "#nome-input-icon, #email-input, #telefone-input-icon, #cep-input-icon, #numero-input-icon",
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

    // campo vazio → sem erro
    if (valor.trim() === "") {
      cepErrorDiv.classList.add("hide");
      return;
    }

    // CEP incompleto ou inválido → mostra erro
    if (!cepValido(valor)) {
      cepErrorDiv.classList.remove("hide");
      return;
    }

    // CEP válido → busca API
    try {
      const dados = await buscarCEP(valor);

      cepInput.disabled = true;

      enderecoInput.value = dados.logradouro;
      bairroInput.value = dados.bairro;

      cidadeSelect.innerHTML = `<option>${dados.localidade}</option>`;
      estadoSelect.innerHTML = `<option>${dados.uf}</option>`;

      cepErrorDiv.classList.add("hide"); // ✅ remove erro
    } catch {
      // CEP não encontrado → erro
      cepErrorDiv.classList.remove("hide");
    }
  });
}

function iniciarTelefone() {
  const telefoneInput = document.getElementById("number-input");

  if (!telefoneInput) return;

  telefoneInput.addEventListener("input", (e) => {
    const valor = aplicarMascaraTelefone(e.target.value);
    e.target.value = valor;

    const telefoneInputIcon = document.getElementById("telefone-input-icon");
    limparErro(telefoneInputIcon);
  });
}

function iniciarSubmitPerfil() {
  const form = document.getElementById("form-aditional-informations");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    alterarPerfil();
  });
}

async function alterarPerfil() {
  if (!validarFormularioPerfil()) return;

  const confirmar = await confirmarAcao("Atualizar");

  if (!confirmar) return;

  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
  const cep = document.getElementById("cep-input").value;

  let endereco = null;

  if (!campoVazio(cep) && cepValido(cep)) {
    endereco = {
      cep: cep,
      logradouro: document.getElementById("endereco-input").value,
      bairro: document.getElementById("bairro-input").value,
      numero: document.getElementById("numero-input").value,
      cidade: document.getElementById("city-select").value,
      estado: document.getElementById("state-select").value,
    };
  }

  const dados = {
    nome: document.getElementById("nome-input").value,
    telefone: removerMascara(document.getElementById("number-input").value),
    endereco: endereco,
  };

  try {
    const atualizado = await alterarUsuarioAPI(usuarioLogado.id, dados);

    console.log("DADOS ENVIADOS:", dados);

    localStorage.setItem("usuario", JSON.stringify(atualizado));

    await mostrarFeedbackAcao("Sucesso", "Atualizar");

    window.location.reload();
  } catch (error) {
    console.error(error);

    await mostrarFeedbackAcao("Falha", "Atualizar");
  }
}

// ===============================
// LIMPAR CEP
// ===============================

export function iniciarLimparCep() {
  const btnLimpar = document.getElementById("limpar-btn");

  if (!btnLimpar) return;

  btnLimpar.addEventListener("click", (e) => {
    e.preventDefault();

    limparEnderecoCompleto();
  });
}

function limparEnderecoCompleto() {
  const cepInput = document.getElementById("cep-input");
  const cepErrorDiv = document.getElementById("cep-error");

  const enderecoInput = document.getElementById("endereco-input");
  const bairroInput = document.getElementById("bairro-input");
  const numeroInput = document.getElementById("numero-input");
  const numeroInputIcon = document.getElementById("numero-input-icon");
  const cidadeSelect = document.getElementById("city-select");
  const estadoSelect = document.getElementById("state-select");

  // limpa CEP
  cepInput.value = "";

  // desbloqueia CEP
  cepInput.disabled = false;

  cepInput.focus();

  // limpa campos de endereço
  enderecoInput.value = "";
  bairroInput.value = "";
  numeroInput.value = "";

  limparErro(numeroInputIcon);

  cidadeSelect.innerHTML = "<option>Selecione</option>";
  estadoSelect.innerHTML = "<option>Selecione</option>";

  // esconde erro
  cepErrorDiv.classList.add("hide");
}

function iniciarUploadImagemPerfil() {
  const imgPreview = document.getElementById("user-img-preview");
  const imgInput = document.getElementById("user-img-input");

  if (!imgPreview || !imgInput) return;

  // clicar na imagem abre o file
  imgPreview.addEventListener("click", () => {
    imgInput.click();
  });

  const tiposPermitidos = ["image/jpeg", "image/png", "image/jpg"];

  imgInput.addEventListener("change", async () => {
    const arquivo = imgInput.files[0];

    if (!arquivo) return;

    // valida tipo
    if (!tiposPermitidos.includes(arquivo.type)) {
      alert("Formato inválido (jpeg, png, jpg)");
      imgInput.value = "";
      return;
    }

    const url = URL.createObjectURL(arquivo);
    imgPreview.src = url;

    try {
      const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

      const formData = new FormData();
      formData.append("imagem", arquivo);

      const atualizado = await atualizarImagemUsuarioAPI(
        usuarioLogado.id,
        formData,
      );

      localStorage.setItem("usuario", JSON.stringify(atualizado));

      // (opcional) feedback
      await mostrarFeedbackAcao("Sucesso", "Atualizar imagem");
    } catch (erro) {
      console.error("Erro ao enviar imagem:", erro);

      await mostrarFeedbackAcao("Falha", "Atualizar imagem");
    }
  });
}
