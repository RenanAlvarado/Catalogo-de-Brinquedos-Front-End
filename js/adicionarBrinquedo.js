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
} from "./api.js";

import { renderizarSelect, renderizarAlterarBrinquedo } from "./render.js";

import { aplicarMascaraPreco } from "./utils/masks.js";

import {
  campoVazio,
  normalizarPreco,
  selectNaoSelecionado,
} from "./utils/validators.js";

// ===============================
// ESTADOS
// ===============================

let isEdicao = false;

// ===============================
// INICIALIZAÇÃO
// ===============================

export async function iniciarPaginaAdicionar() {
  await carregarMarcasSelect();
  await carregarCategoriasSelect();

  isEdicao = await carregarModoEdicao();

  configurarModoTela();

  iniciarUploadImagem();
  iniciarMascaraPreco();
  iniciarLimparFormulario();
  iniciarValidacaoFormulario();
}

// ===============================
// DIFERENÇAS ENTRE CRIAR E ALTERAR
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
// CARREGAR INFORMAÇÕES NA TELA
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
// CARREGAMENTO DOS SELECTS
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
export function iniciarMascaraPreco() {
  const precoInput = document.getElementById("preco-input");

  if (!precoInput) return;

  precoInput.addEventListener("input", (e) => {
    e.target.value = aplicarMascaraPreco(e.target.value);
  });
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
// LIMPAR FORMULÁRIO
// ===============================
export function iniciarLimparFormulario() {
  const form = document.getElementById("adicionar-brinquedo-form");
  const btnLimpar = document.getElementById("limpar-btn");

  if (!form || !btnLimpar) return;

  btnLimpar.addEventListener("click", (e) => {
    e.preventDefault();
    // limpa inputs padrão
    form.reset();

    //  limpar preview da imagem
    const imgPreview = document.getElementById("img-preview");
    const imgInput = document.getElementById("img-input");
    const uploadText = document.getElementById("upload-text");
    const uploadBtn = document.getElementById("upload-btn");
    const uploadIcon = document.getElementById("upload-icon");

    if (imgPreview) {
      URL.revokeObjectURL(imgPreview.src);
      imgPreview.src = "img/placeholder.png";
    }

    if (imgInput) {
      imgInput.value = "";
    }

    if (uploadText) {
      uploadText.textContent = "Selecionar imagem";
    }

    if (uploadBtn) {
      uploadBtn.classList.remove("active");
    }

    if (uploadIcon) {
      uploadIcon.classList.remove("fa-xmark");
      uploadIcon.classList.add("fa-upload");
    }

    const camposErro = [
      document.getElementById("nome-input-icon"),
      document.getElementById("descricao-input"),
      document.getElementById("price-input-icon"),
      document.getElementById("marca-input"),
      document.getElementById("categoria-input"),
    ];

    camposErro.forEach((campo) => {
      if (campo) limparErro(campo);
    });
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
  const descricao = document.getElementById("descricao-input");
  const preco = document.getElementById("preco-input");
  const precoInputIcon = document.getElementById("price-input-icon");
  const marca = document.getElementById("marca-input");
  const categoria = document.getElementById("categoria-input");

  let valido = true;

  if (campoVazio(nome.value)) {
    marcarErro(nomeInputIcon);
    valido = false;
  } else limparErro(nomeInputIcon);

  if (campoVazio(descricao.value)) {
    marcarErro(descricao);
    valido = false;
  } else limparErro(descricao);

  const precoNormalizado = normalizarPreco(preco.value);

  if (
    campoVazio(preco.value) ||
    isNaN(precoNormalizado) ||
    precoNormalizado <= 0
  ) {
    marcarErro(precoInputIcon);
    valido = false;
  } else {
    limparErro(precoInputIcon);
  }

  if (selectNaoSelecionado(marca.value)) {
    marcarErro(marca);
    valido = false;
  } else limparErro(marca);

  if (selectNaoSelecionado(categoria.value)) {
    marcarErro(categoria);
    valido = false;
  } else limparErro(categoria);

  return valido;
}

function adicionarRemocaoErroEmTempoReal() {
  const campos = document.querySelectorAll(
    "#nome-input-icon, #descricao-input, #price-input-icon, #marca-input, #categoria-input",
  );

  campos.forEach((campo) => {
    campo.addEventListener("input", () => limparErro(campo));
    campo.addEventListener("change", () => limparErro(campo));
  });
}

export function iniciarValidacaoFormulario() {
  const form = document.getElementById("adicionar-brinquedo-form");

  if (!form) return;

  adicionarRemocaoErroEmTempoReal();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    salvarOuAlterarBrinquedo();
  });
}

// ===============================
// CONFIRMAÇÃO POR MODAL
// ===============================
function confirmarAcao(mensagem) {
  return new Promise((resolve) => {
    const modal = document.getElementById("modal-confirmacao");
    const texto = document.querySelector(".modal-content span");
    const btnConfirmar = document.getElementById("confirmar-btn");
    const btnCancelar = document.getElementById("cancelar-btn");

    if (!modal) {
      console.error("Modal não encontrado");
      resolve(false);
      return;
    }

    // seta mensagem
    if (texto) texto.textContent = mensagem;

    if (btnConfirmar) btnConfirmar.textContent = mensagem;

    modal.classList.remove("hidden");

    function limpar() {
      modal.classList.add("hidden");
      btnConfirmar.removeEventListener("click", onConfirmar);
      btnCancelar.removeEventListener("click", onCancelar);
    }

    function onConfirmar() {
      limpar();
      resolve(true);
    }

    function onCancelar() {
      limpar();
      resolve(false);
    }

    btnConfirmar.addEventListener("click", onConfirmar);
    btnCancelar.addEventListener("click", onCancelar);
  });
}

// ===============================
// MOSTRAR SUCESSO DA AÇÃO
// ===============================
function mostrarFeedbackAcao(tipo, mensagem) {
  return new Promise((resolve) => {
    const modal = document.getElementById("modal-feedback");
    const titulo = document.querySelector("#feedback-title");
    const textoTipo = document.querySelector("#feedback-type-span");
    const texto = document.querySelector("#feedback-span");
    const btnFechar = document.getElementById("ok-btn");

    if (!modal) {
      console.error("Modal não encontrado");
      resolve(false);
      return;
    }

    // seta mensagem
    if (titulo) titulo.textContent = tipo;
    if (textoTipo) textoTipo.textContent = tipo;
    if (texto) texto.textContent = mensagem;

    modal.classList.remove("hidden");

    function limpar() {
      modal.classList.add("hidden");

      btnFechar.removeEventListener("click", onFechar);
    }

    function onFechar() {
      limpar();
      resolve(false);
    }

    btnFechar.addEventListener("click", onFechar);
  });
}

// ===============================
// MONTAR OBJETO JSON PARA ENVIO AO BD
// ===============================

const deleteBtn = document.getElementById("delete-btn");

if (deleteBtn) {
  deleteBtn.addEventListener("click", deletarBrinquedo);
}

// ===============================
// MONTAR OBJETO JSON PARA ENVIO AO BD
// ===============================

function montarObjetoBrinquedo() {
  const nome = document.getElementById("nome-input").value;
  const descricao = document.getElementById("descricao-input").value;
  const preco = document.getElementById("preco-input").value;
  const marca = document.getElementById("marca-input").value;
  const categoria = document.getElementById("categoria-input").value;
  const imgInput = document.getElementById("img-input");

  const arquivo = imgInput.files[0];
  const nomeImagem = arquivo ? arquivo.name : "";

  return {
    nome,
    descricao,
    imagem: nomeImagem,
    preco: normalizarPreco(preco),
    marca: { id: Number(marca) },
    categoria: { id: Number(categoria) },
  };
}

// ===============================
// FUNÇÕES DE CRUD DOS BRINQUEDOS
// ===============================

// Método para salvar brinquedos
async function salvarOuAlterarBrinquedo() {
  const brinquedo = montarObjetoBrinquedo();

  const imgInput = document.getElementById("img-input");
  const arquivo = imgInput.files[0];

  const formData = new FormData();

  formData.append("brinquedo", JSON.stringify(brinquedo));

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
      data = await alterarBrinquedoAPI(id, formData);

      console.log("Atualizado:", data);

      await mostrarFeedbackAcao("Sucesso", "Alterar");
    } else {
      const confirmar = await confirmarAcao("Salvar");

      if (!confirmar) return;
      // Salvar
      data = await salvarBrinquedoAPI(formData);

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

// Deletar brinquedo
async function deletarBrinquedo() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("Nenhum brinquedo selecionado.");
    return;
  }

  const confirmar = await confirmarAcao("Excluir");

  if (!confirmar) return;

  try {
    await deletarBrinquedoAPI(id);

    await mostrarFeedbackAcao("Sucesso", "Excluir");

    window.location.href = "index.html";
  } catch (erro) {
    console.error("Erro ao deletar:", erro);
    await mostrarFeedbackAcao("Falha", "Excluir");
  }
}
