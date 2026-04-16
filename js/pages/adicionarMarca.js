// ===============================
// IMPORTS
// ===============================

import {
  buscarMarcaPorId,
  salvarMarcaAPI,
  alterarMarcaAPI,
  deletarMarcaAPI,
  buscarBrinquedosPorMarca,
} from "../api.js";

import { renderizarAlterarMarca } from "../render.js";

import { confirmarAcao, mostrarFeedbackAcao } from "../utils/modals.js";

import { campoVazio } from "../utils/validators.js";

import {
  marcarErro,
  limparErros,
  adicionarRemocaoErroTempoReal,
} from "../utils/formUtils.js";

// ===============================
// ESTADOS
// ===============================

let isEdicao = false;

// ===============================
// INICIALIZAÇÃO
// ===============================

export async function iniciarPaginaAdicionarMarca() {
  isEdicao = await carregarModoEdicao();

  configurarModoTela();

  iniciarUploadImagem();

  adicionarRemocaoErroTempoReal();
  iniciarValidacaoFormulario();
}

// ===============================
// CONFIGURAR MODO (CRIAR / EDITAR)
// ===============================

function configurarModoTela() {
  const titulo = document.getElementById("title-brand-form");
  const botaoSubmit = document.querySelector("#salvar-marca-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const idInput = document.querySelector("#id-input-icon");

  if (isEdicao) {
    if (titulo) titulo.textContent = "Editar Marca";
    if (botaoSubmit) botaoSubmit.textContent = "Atualizar";
    if (deleteBtn) deleteBtn.style.display = "block";
  } else {
    if (idInput) idInput.style.display = "none";
    if (titulo) titulo.textContent = "Adicionar Marca";
    if (botaoSubmit) botaoSubmit.textContent = "Salvar";
    if (deleteBtn) deleteBtn.style.display = "none";
  }
}

// ===============================
// CARREGAR MODO EDIÇÃO
// ===============================

export async function carregarModoEdicao() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return false;

  try {
    const marca = await buscarMarcaPorId(id);
    renderizarAlterarMarca(marca);
    return true;
  } catch (erro) {
    console.error("Erro ao carregar marca:", erro);
    return false;
  }
}

// ===============================
// UPLOAD DE IMAGEM
// ===============================

function iniciarUploadImagem() {
  const imgInput = document.getElementById("img-input");
  const uploadText = document.getElementById("upload-text");
  const uploadBtn = document.getElementById("upload-btn");
  const uploadIcon = document.getElementById("upload-icon");
  const imgPreview = document.getElementById("img-preview");
  const imgErrorMsg = document.querySelector("#left-section p");

  if (imgPreview && imgInput) {
    imgPreview.addEventListener("click", () => {
      if (imgInput.files.length === 0) imgInput.click();
    });
  }

  if (!imgInput || !uploadText || !uploadBtn || !uploadIcon || !imgPreview)
    return;

  const tiposPermitidos = ["image/jpeg", "image/png", "image/jpg"];

  imgInput.addEventListener("change", () => {
    if (imgInput.files.length > 1) {
      imgErrorMsg.textContent = "Envie apenas uma imagem!";
      imgErrorMsg.classList.add("active");
      imgInput.value = "";
      uploadText.textContent = "Selecionar imagem";
      return;
    }

    const arquivo = imgInput.files[0];

    if (!tiposPermitidos.includes(arquivo.type)) {
      imgErrorMsg.textContent = "*Arquivos aceitos: jpeg, png, jpg*";
      imgErrorMsg.classList.add("active");
      imgInput.value = "";
      return;
    }

    if (arquivo) {
      const url = URL.createObjectURL(arquivo);
      imgPreview.src = url;

      uploadText.textContent =
        arquivo.name.length > 40
          ? arquivo.name.substring(0, 40) + "..."
          : arquivo.name;

      uploadBtn.classList.add("active");
      uploadIcon.classList.replace("fa-upload", "fa-xmark");
    }
  });

  uploadBtn.addEventListener("click", (e) => {
    if (uploadBtn.classList.contains("active")) {
      e.preventDefault();

      imgPreview.src = "img/placeholder.png";
      imgInput.value = "";
      uploadText.textContent = "Selecionar imagem";

      uploadBtn.classList.remove("active");
      uploadIcon.classList.replace("fa-xmark", "fa-upload");
    }
  });
}

// ===============================
// VALIDAÇÃO
// ===============================

function validarFormulario() {
  const nome = document.getElementById("nome-input").value.trim();

  let valido = true;

  limparErros();

  if (campoVazio(nome)) {
    marcarErro("nome-input", "Nome é obrigatório");
    valido = false;
  }

  return valido;
}

// ===============================
// SUBMIT
// ===============================

function iniciarValidacaoFormulario() {
  const form = document.getElementById("adicionar-marca-form");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    salvarOuAlterarMarca();
  });
}

// ===============================
// MONTAR OBJETO
// ===============================

function montarObjetoMarca() {
  const nome = document.getElementById("nome-input").value;
  const imgInput = document.getElementById("img-input");

  const arquivo = imgInput.files[0];

  return {
    nome,
    imagem: arquivo ? arquivo.name : "",
  };
}

// ===============================
// SALVAR / ALTERAR
// ===============================

async function salvarOuAlterarMarca() {
  const marca = montarObjetoMarca();

  const imgInput = document.getElementById("img-input");
  const arquivo = imgInput.files[0];

  const formData = new FormData();
  formData.append("marca", JSON.stringify(marca));

  if (arquivo) formData.append("imagem", arquivo);

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    let data;

    if (id) {
      if (!(await confirmarAcao("Atualizar"))) return;

      data = await alterarMarcaAPI(id, formData);
      await mostrarFeedbackAcao("Sucesso", "Alterar");
    } else {
      if (!(await confirmarAcao("Salvar"))) return;

      data = await salvarMarcaAPI(formData);
      await mostrarFeedbackAcao("Sucesso", "Salvar");
    }

    console.log("Resultado:", data);
    window.location.href = "index.html";
  } catch (erro) {
    console.error("Erro:", erro);
    await mostrarFeedbackAcao("Falha", "Salvar");
  }
}

// ===============================
// DELETAR
// ===============================

async function deletarMarca() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    await mostrarFeedbackAcao("Erro", "Nenhuma Marca selecionada.");
    return;
  }

  try {
    const brinquedos = await buscarBrinquedosPorMarca(id);
    const quantidade = brinquedos?.length || 0;

    const frase = document.querySelector("#frase-modal");

    if (quantidade > 0) {
      frase.innerHTML = `Esta Marca possui <strong>${quantidade}</strong> brinquedo(s). Deseja excluir mesmo assim?`;
    } else {
      frase.textContent = "Tem certeza que deseja excluir essa Marca?";
    }

    const confirmar = await confirmarAcao("Excluir");

    if (!confirmar) return;

    await deletarMarcaAPI(id);

    await mostrarFeedbackAcao("Sucesso", "Excluir");

    window.location.href = "index.html";
  } catch (erro) {
    console.error("Erro ao deletar:", erro);
    await mostrarFeedbackAcao("Erro", "Falha ao excluir Marca");
  }
}

// ===============================
// EVENTO DELETE
// ===============================

const deleteBtn = document.getElementById("delete-marca-btn");

if (deleteBtn) {
  deleteBtn.addEventListener("click", deletarMarca);
}
