// ===============================
// IMPORTS
// ===============================

import {
  buscarMarcaPorId,
  salvarMarcaAPI,
  alterarMarcaAPI,
  deletarMarcaAPI,
} from "../api.js";

import { renderizarAlterarMarca } from "../render.js";

import { confirmarAcao, mostrarFeedbackAcao } from "../utils/modals.js";

import { campoVazio } from "../utils/validators.js";

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

  iniciarValidacaoFormulario();
}

// ===============================
// DIFERENÇAS ENTRE CRIAR E ALTERAR
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
// CARREGAR INFORMAÇÕES NA TELA
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
// UPLOAD E CARREGAMENTO DA IMAGEM
// ===============================

export function iniciarUploadImagem() {
  const imgInput = document.getElementById("img-input");
  const uploadText = document.getElementById("upload-text");
  const uploadBtn = document.getElementById("upload-btn");
  const uploadIcon = document.getElementById("upload-icon");
  const imgPreview = document.getElementById("img-preview");
  const imgErrorMsg = document.querySelector("#left-section p");

  if (imgPreview && imgInput) {
    imgPreview.addEventListener("click", () => {
      if (imgInput.files.length === 0) {
        imgInput.click();
      }
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

    if (imgInput.files.length === 1) {
      const nome = imgInput.files[0].name;

      const file = imgInput.files[0];

      const url = URL.createObjectURL(file);
      imgPreview.src = url;

      uploadText.textContent =
        nome.length > 40 ? nome.substring(0, 40) + "..." : nome;

      uploadBtn.classList.add("active");
      uploadIcon.classList.remove("fa-upload");
      uploadIcon.classList.add("fa-xmark");
    } else {
      uploadText.textContent = "Selecionar imagem";
    }
  });

  uploadBtn.addEventListener("click", (e) => {
    // se já tem imagem ele remove
    if (uploadBtn.classList.contains("active")) {
      e.preventDefault();

      imgPreview.src = "img/placeholder.png";

      imgInput.value = "";
      uploadText.textContent = "Selecionar imagem";

      uploadBtn.classList.remove("active");
      uploadIcon.classList.remove("fa-xmark");
      uploadIcon.classList.add("fa-upload");
    }
  });
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

function validarFormulario() {
  const nome = document.getElementById("nome-input");
  const nomeInputIcon = document.getElementById("nome-input-icon");

  let valido = true;

  if (campoVazio(nome.value)) {
    marcarErro(nomeInputIcon);
    valido = false;
  } else limparErro(nomeInputIcon);

  return valido;
}

function adicionarRemocaoErroEmTempoReal() {
  const campos = document.querySelectorAll("#nome-input-icon");

  campos.forEach((campo) => {
    campo.addEventListener("input", () => limparErro(campo));
    campo.addEventListener("change", () => limparErro(campo));
  });
}

export function iniciarValidacaoFormulario() {
  const form = document.getElementById("adicionar-marca-form");

  if (!form) return;

  adicionarRemocaoErroEmTempoReal();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    salvarOuAlterarMarca();
  });
}

function montarObjetoMarca() {
  const nome = document.getElementById("nome-input").value;
  const imgInput = document.getElementById("img-input");

  const arquivo = imgInput.files[0];
  const nomeImagem = arquivo ? arquivo.name : "";

  return {
    nome,
    imagem: nomeImagem,
  };
}

// ===============================
// FUNÇÕES DE CRUD DAS MARCAS
// ===============================

// Método para salvar marcas
async function salvarOuAlterarMarca() {
  const marca = montarObjetoMarca();

  const imgInput = document.getElementById("img-input");
  const arquivo = imgInput.files[0];

  const formData = new FormData();

  formData.append("marca", JSON.stringify(marca));

  if (arquivo) {
    formData.append("imagem", arquivo);
  }

  // ID DA URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    let data;

    if (id) {
      const confirmar = await confirmarAcao("Atualizar");

      if (!confirmar) return;

      // Atualizar
      data = await alterarMarcaAPI(id, formData);

      console.log("Atualizado:", data);

      await mostrarFeedbackAcao("Sucesso", "Alterar");
    } else {
      const confirmar = await confirmarAcao("Salvar");

      if (!confirmar) return;
      // Salvar
      data = await salvarMarcaAPI(formData);

      await mostrarFeedbackAcao("Sucesso", "Salvar");

      console.log("Criado:", data);
    }

    //  Voltar ao Index
    window.location.href = "index.html";
  } catch (erro) {
    console.error("Erro:", erro);
    await mostrarFeedbackAcao("Falha", "Salvar");
  }
}

// Deletar marca
async function deletarMarca() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("Nenhuma marca selecionada.");
    return;
  }

  const confirmar = await confirmarAcao("Excluir");

  if (!confirmar) return;

  try {
    await deletarMarcaAPI(id);

    await mostrarFeedbackAcao("Sucesso", "Excluir");

    window.location.href = "index.html";
  } catch (erro) {
    console.error("Erro ao deletar:", erro);
    await mostrarFeedbackAcao("Falha", "Excluir");
  }
}

const deleteBtn = document.getElementById("delete-btn");

if (deleteBtn) {
  deleteBtn.addEventListener("click", deletarMarca);
}
