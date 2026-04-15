// ===============================
// IMPORTS
// ===============================
import {
  buscarCategoriaPorId,
  salvarCategoriaAPI,
  alterarCategoriaAPI,
  deletarCategoriaAPI,
} from "../api.js";

import { renderizarAlterarCategoria } from "../render.js";

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
export async function iniciarPaginaAdicionarCategoria() {
  isEdicao = await carregarModoEdicao();

  configurarModoTela();

  iniciarUploadImagem();

  adicionarRemocaoErroTempoReal(); // 🔥 padrão global

  iniciarValidacaoFormulario();
}

// ===============================
// CONFIGURAR MODO
// ===============================
function configurarModoTela() {
  const titulo = document.getElementById("title-categorie-form");
  const botaoSubmit = document.querySelector("#salvar-categoria-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const idInput = document.querySelector("#id-input-icon");

  if (isEdicao) {
    if (titulo) titulo.textContent = "Editar Categoria";
    if (botaoSubmit) botaoSubmit.textContent = "Atualizar";
    if (deleteBtn) deleteBtn.style.display = "block";
  } else {
    if (idInput) idInput.style.display = "none";
    if (titulo) titulo.textContent = "Adicionar Categoria";
    if (botaoSubmit) botaoSubmit.textContent = "Salvar";
    if (deleteBtn) deleteBtn.style.display = "none";
  }
}

// ===============================
// CARREGAR EDIÇÃO
// ===============================
export async function carregarModoEdicao() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return false;

  try {
    const categoria = await buscarCategoriaPorId(id);
    renderizarAlterarCategoria(categoria);
    return true;
  } catch (erro) {
    console.error("Erro ao carregar categoria:", erro);
    return false;
  }
}

// ===============================
// UPLOAD IMAGEM
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
  const form = document.getElementById("adicionar-categoria-form");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    salvarOuAlterarCategoria();
  });
}

// ===============================
// MONTAR OBJETO
// ===============================
function montarObjetoCategoria() {
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
async function salvarOuAlterarCategoria() {
  const categoria = montarObjetoCategoria();

  const imgInput = document.getElementById("img-input");
  const arquivo = imgInput.files[0];

  const formData = new FormData();
  formData.append("categoria", JSON.stringify(categoria));

  if (arquivo) formData.append("imagem", arquivo);

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    let data;

    if (id) {
      if (!(await confirmarAcao("Atualizar"))) return;

      data = await alterarCategoriaAPI(id, formData);
      await mostrarFeedbackAcao("Sucesso", "Alterar");
    } else {
      if (!(await confirmarAcao("Salvar"))) return;

      data = await salvarCategoriaAPI(formData);
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
async function deletarCategoria() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("Nenhuma categoria selecionada.");
    return;
  }

  if (!(await confirmarAcao("Excluir"))) return;

  try {
    await deletarCategoriaAPI(id);
    await mostrarFeedbackAcao("Sucesso", "Excluir");
    window.location.href = "index.html";
  } catch (erro) {
    console.error("Erro ao deletar:", erro);
    await mostrarFeedbackAcao("Falha", "Excluir");
  }
}

// ===============================
// EVENTO DELETE
// ===============================
const deleteBtn = document.getElementById("delete-btn");

if (deleteBtn) {
  deleteBtn.addEventListener("click", deletarCategoria);
}
