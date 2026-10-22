// ===============================
// IMPORTS
// ===============================
import { cadastroAPI } from "../api.js";

import {
  marcarErro,
  limparErros,
  adicionarRemocaoErroTempoReal,
  mostrarErroGeral,
  limparErroGeral,
} from "../utils/formUtils.js";

import {
  campoVazio,
  emailValido,
  senhaMinimaValida,
  senhasIguais,
  nomeCompletoValido,
} from "../utils/validators.js";

// ===============================
// FUNÇÕES DE VISUALIZAR SENHA
// ===============================
function iniciarToggleSenha() {
  const senhaInput = document.getElementById("password-input");
  const senhaInputAgain = document.getElementById("password-again-input");
  const toggleIcon = document.getElementById("toggle-password");
  const toggleIconAgain = document.getElementById("toggle-password-again");

  if (!senhaInput || !toggleIcon) return;

  toggleIcon.addEventListener("click", () => {
    const tipoAtual = senhaInput.getAttribute("type");

    if (tipoAtual === "password") {
      senhaInput.setAttribute("type", "text");
      toggleIcon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      senhaInput.setAttribute("type", "password");
      toggleIcon.classList.replace("fa-eye-slash", "fa-eye");
    }
  });

  toggleIconAgain.addEventListener("click", () => {
    const tipoAtual = senhaInputAgain.getAttribute("type");

    if (tipoAtual === "password") {
      senhaInputAgain.setAttribute("type", "text");
      toggleIconAgain.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      senhaInputAgain.setAttribute("type", "password");
      toggleIconAgain.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
}

// ===============================
// FUNÇÃO DE CADASTRO
// ===============================
async function realizarCadastro() {
  const nome = document.getElementById("nome-input").value.trim();
  const email = document.getElementById("email-input").value.trim();
  const senha = document.getElementById("password-input").value.trim();
  const confirmarSenha = document
    .getElementById("password-again-input")
    .value.trim();

  let valido = true;

  // limpa erros anteriores
  limparErros();
  limparErroGeral("cadastro-error");

  // ===============================
  // VALIDAÇÕES COM VALIDATORS
  // ===============================

  // nome
  if (campoVazio(nome)) {
    marcarErro("nome-input", "Nome é obrigatório");
    valido = false;
  } else if (!nomeCompletoValido(nome)) {
    marcarErro("nome-input", "Digite o nome completo");
    valido = false;
  }

  // email
  if (campoVazio(email)) {
    marcarErro("email-input", "Email é obrigatório");
    valido = false;
  } else if (!emailValido(email)) {
    marcarErro("email-input", "Email inválido");
    valido = false;
  }

  // senha
  if (campoVazio(senha)) {
    marcarErro("password-input", "Senha é obrigatória");
    valido = false;
  } else if (!senhaMinimaValida(senha)) {
    marcarErro("password-input", "Mínimo 6 caracteres");
    valido = false;
  }

  // confirmar senha
  if (campoVazio(confirmarSenha)) {
    marcarErro("password-again-input", "Confirme sua senha");
    valido = false;
  } else if (!senhasIguais(senha, confirmarSenha)) {
    marcarErro("password-input", "");

    mostrarErroGeral("cadastro-error", "Senhas devem ser iguais!");
    valido = false;
  }

  if (!valido) return;

  // ===============================
  // CHAMADA API
  // ===============================
  try {
    const usuarioCriado = await cadastroAPI(nome, email, senha, confirmarSenha);

    localStorage.setItem("usuario", JSON.stringify(usuarioCriado));
    window.location.href = "index.html";
  } catch (erro) {
    console.error("Erro no cadastro:", erro);

    // tratamento de erro do backend
    if (erro && typeof erro === "object") {
      if (erro.nome) marcarErro("nome-input", erro.nome);
      if (erro.email) marcarErro("email-input", erro.email);
      if (erro.senha) marcarErro("password-input", erro.senha);
      if (erro.confirmarSenha) {
        marcarErro("password-again-input", erro.confirmarSenha);
      }
    } else {
      mostrarErroGeral(
        "cadastro-error",
        "Erro ao criar conta. Verifique os dados.",
      );
    }
  }
}

// ===============================
// EVENTO DO FORM
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");

  if (!form) {
    console.error("Formulário não encontrado");
    return;
  }

  iniciarToggleSenha();
  adicionarRemocaoErroTempoReal();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    realizarCadastro();
  });
});
