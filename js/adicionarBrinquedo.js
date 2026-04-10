// ===============================
// IMPORTS
// ===============================

import { buscarMarcas, buscarCategorias, salvarBrinquedoAPI } from "./api.js";

import { renderizarSelect } from "./render.js";

import {
  campoVazio,
  normalizarPreco,
  selectNaoSelecionado,
} from "./utils/validators.js";

// ===============================
// CARREGAMENTO DA IMAGEM
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

  const deleteBtn = document.getElementById("delete-btn");

  if (deleteBtn) {
    deleteBtn.addEventListener("click", deletarBrinquedo);
  }

  if (!form) return;

  adicionarRemocaoErroEmTempoReal();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    salvarBrinquedo();
  });
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
async function salvarBrinquedo() {
  const brinquedo = montarObjetoBrinquedo();

  const imgInput = document.getElementById("img-input");
  const arquivo = imgInput.files[0];

  const formData = new FormData();

  const id = document.getElementById("id-input").value;

  const url = id
    ? `http://localhost:8080/api/brinquedos/${id}`
    : "http://localhost:8080/api/brinquedos";

  const method = id ? "PUT" : "POST";

  // envia JSON como string
  formData.append("brinquedo", JSON.stringify(brinquedo));

  // envia imagem
  if (arquivo) {
    formData.append("imagem", arquivo);
  }

  try {
    const data = await salvarBrinquedoAPI(formData, url, method);

    console.log("Salvo com sucesso:", data);
    alert("Brinquedo salvo com sucesso!");
  } catch (erro) {
    console.error("Erro:", erro);
    alert("Erro ao salvar brinquedo");
  }
}

// Pegar ID do URL para editar os brinquedos
function pegarIdDaUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Deletar brinquedo
async function deletarBrinquedo() {
  const id = document.getElementById("id-input").value;

  if (!id) {
    alert("Nenhum brinquedo selecionado para deletar");
    return;
  }

  const confirmar = confirm("Tem certeza que deseja excluir este brinquedo?");
  if (!confirmar) return;

  try {
    const response = await fetch(`http://localhost:8080/api/brinquedos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar");
    }

    alert("Brinquedo excluído com sucesso!");

    // Redireciona para home
    window.location.href = "index.html";
  } catch (erro) {
    console.error("Erro:", erro);
    alert("Erro ao excluir brinquedo");
  }
}
