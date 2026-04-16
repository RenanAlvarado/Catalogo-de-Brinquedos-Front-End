// ===============================
// IMPORTS
// ===============================
import {
  buscarMarcas,
  buscarCategorias,
  salvarBrinquedoAPI,
  deletarBrinquedoAPI,
  alterarBrinquedoAPI,
  buscarBrinquedoPorId,
} from "../api.js";

import { renderizarSelect, renderizarAlterarBrinquedo } from "../render.js";

import { aplicarMascaraPreco } from "../utils/masks.js";

import { confirmarAcao, mostrarFeedbackAcao } from "../utils/modals.js";

import {
  campoVazio,
  normalizarPreco,
  selectNaoSelecionado,
} from "../utils/validators.js";

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
export async function iniciarPaginaAdicionarBrinquedo() {
  await carregarMarcasSelect();
  await carregarCategoriasSelect();

  isEdicao = await carregarModoEdicao();

  configurarModoTela();

  iniciarUploadImagem();
  iniciarMascaraPreco();
  iniciarLimparFormulario();
  adicionarRemocaoErroTempoReal();
  iniciarValidacaoFormulario();

  const backBtn = document.querySelector(".arrow-index-back");

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
}

// ===============================
// CONFIGURAR MODO (CRIAR / EDITAR)
// ===============================
function configurarModoTela() {
  const titulo = document.getElementById("title-toy-form");
  const botaoSubmit = document.querySelector("#salvar-brinquedo-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const idInput = document.querySelector("#id-input-icon");

  if (isEdicao) {
    if (titulo) titulo.textContent = "Editar Brinquedo";
    if (botaoSubmit) botaoSubmit.textContent = "Atualizar";
    if (deleteBtn) deleteBtn.style.display = "block";
  } else {
    if (idInput) idInput.style.display = "none";
    if (titulo) titulo.textContent = "Adicionar Brinquedo";
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
    const brinquedo = await buscarBrinquedoPorId(id);
    renderizarAlterarBrinquedo(brinquedo);
    return true;
  } catch (erro) {
    console.error("Erro ao carregar brinquedo:", erro);
    return false;
  }
}

// ===============================
// SELECTS
// ===============================
export async function carregarMarcasSelect() {
  const select = document.getElementById("marca-input");
  if (!select) return;

  try {
    const marcas = await buscarMarcas();
    renderizarSelect(select, marcas, "Selecione a Marca:");
  } catch (erro) {
    console.error("Erro ao carregar marcas:", erro);
  }
}

export async function carregarCategoriasSelect() {
  const select = document.getElementById("categoria-input");
  if (!select) return;

  try {
    const categorias = await buscarCategorias();
    renderizarSelect(select, categorias, "Selecione a Categoria:");
  } catch (erro) {
    console.error("Erro ao carregar categorias:", erro);
  }
}

// ===============================
// MÁSCARA DE PREÇO
// ===============================
function iniciarMascaraPreco() {
  const precoInput = document.getElementById("preco-input");

  if (!precoInput) return;

  precoInput.addEventListener("input", (e) => {
    e.target.value = aplicarMascaraPreco(e.target.value);
  });
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
// LIMPAR FORMULÁRIO
// ===============================
function iniciarLimparFormulario() {
  const form = document.getElementById("adicionar-brinquedo-form");
  const btnLimpar = document.getElementById("limpar-btn");

  if (!form || !btnLimpar) return;

  btnLimpar.addEventListener("click", (e) => {
    e.preventDefault();

    form.reset();
    limparErros();

    const imgPreview = document.getElementById("img-preview");
    const imgInput = document.getElementById("img-input");
    const uploadText = document.getElementById("upload-text");
    const uploadBtn = document.getElementById("upload-btn");
    const uploadIcon = document.getElementById("upload-icon");

    if (imgPreview) imgPreview.src = "img/placeholder.png";
    if (imgInput) imgInput.value = "";
    if (uploadText) uploadText.textContent = "Selecionar imagem";

    if (uploadBtn) uploadBtn.classList.remove("active");
    if (uploadIcon) uploadIcon.classList.replace("fa-xmark", "fa-upload");
  });
}

// ===============================
// VALIDAÇÃO
// ===============================
function validarFormulario() {
  const nome = document.getElementById("nome-input").value.trim();
  const descricao = document.getElementById("descricao-input").value.trim();
  const preco = document.getElementById("preco-input").value.trim();
  const marca = document.getElementById("marca-input").value;
  const categoria = document.getElementById("categoria-input").value;

  let valido = true;

  limparErros();

  // Nome
  if (campoVazio(nome)) {
    marcarErro("nome-input", "Nome é obrigatório");
    valido = false;
  }

  // Descrição
  if (campoVazio(descricao)) {
    marcarErro("descricao-input", "Descrição é obrigatória");
    valido = false;
  }

  // Preço
  const precoNormalizado = normalizarPreco(preco);

  if (campoVazio(preco)) {
    marcarErro("preco-input", "Preço é obrigatório");
    valido = false;
  } else if (isNaN(precoNormalizado) || precoNormalizado <= 0) {
    marcarErro("preco-input", "Preço inválido");
    valido = false;
  }

  // // Marca
  if (selectNaoSelecionado(marca)) {
    marcarErro("marca-input", "Selecione uma marca");
    valido = false;
  }

  // // Categoria
  if (selectNaoSelecionado(categoria)) {
    marcarErro("categoria-input", "Selecione uma categoria");
    valido = false;
  }

  return valido;
}

// ===============================
// SUBMIT
// ===============================
function iniciarValidacaoFormulario() {
  const form = document.getElementById("adicionar-brinquedo-form");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    salvarOuAlterarBrinquedo();
  });
}

// ===============================
// MONTAR OBJETO
// ===============================
function montarObjetoBrinquedo() {
  const nome = document.getElementById("nome-input").value;
  const descricao = document.getElementById("descricao-input").value;
  const preco = document.getElementById("preco-input").value;
  const marca = document.getElementById("marca-input").value;
  const categoria = document.getElementById("categoria-input").value;
  const imgInput = document.getElementById("img-input");

  const arquivo = imgInput.files[0];

  return {
    nome,
    descricao,
    imagem: arquivo ? arquivo.name : "",
    preco: normalizarPreco(preco),
    marca: { id: Number(marca) },
    categoria: { id: Number(categoria) },
  };
}

// ===============================
// SALVAR / ALTERAR
// ===============================
async function salvarOuAlterarBrinquedo() {
  const brinquedo = montarObjetoBrinquedo();
  const imgInput = document.getElementById("img-input");
  const arquivo = imgInput.files[0];

  const formData = new FormData();
  formData.append("brinquedo", JSON.stringify(brinquedo));

  if (arquivo) formData.append("imagem", arquivo);

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    let data;

    if (id) {
      if (!(await confirmarAcao("Atualizar"))) return;

      data = await alterarBrinquedoAPI(id, formData);
      await mostrarFeedbackAcao("Sucesso", "Alterar");
    } else {
      if (!(await confirmarAcao("Salvar"))) return;

      data = await salvarBrinquedoAPI(formData);
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
async function deletarBrinquedo() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("Nenhum brinquedo selecionado.");
    return;
  }

  if (!(await confirmarAcao("Excluir"))) return;

  try {
    await deletarBrinquedoAPI(id);
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
  deleteBtn.addEventListener("click", deletarBrinquedo);
}
