// ===============================
// IMPORTS
// ===============================
import { cadastroAPI } from "../api.js";
import { marcarErro, limparErros } from "../utils/formUtils.js";

// ===============================
// FUNÇÕES AUXILIARES PARA TRATAMENTO DE ERROS
// ===============================
function adicionarRemocaoErroTempoReal() {
  const inputs = document.querySelectorAll(".input-icon input");

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.style.border = "";

      const erro = input.closest(".input-icon").querySelector(".error-text");
      if (erro) erro.remove();

      limparErroCadastro();
    });
  });
}

function mostrarErroCadastro(mensagem) {
  const erro = document.getElementById("cadastro-error");

  if (!erro) return;

  erro.textContent = mensagem;
  erro.style.display = "block";
}

function limparErroCadastro() {
  const erro = document.getElementById("cadastro-error");

  if (!erro) return;

  erro.textContent = "";
  erro.style.display = "none";
}

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

      toggleIcon.classList.remove("fa-eye");
      toggleIcon.classList.add("fa-eye-slash");
    } else {
      senhaInput.setAttribute("type", "password");

      toggleIcon.classList.remove("fa-eye-slash");
      toggleIcon.classList.add("fa-eye");
    }
  });

  toggleIconAgain.addEventListener("click", () => {
    const tipoAtual = senhaInputAgain.getAttribute("type");

    if (tipoAtual === "password") {
      senhaInputAgain.setAttribute("type", "text");

      toggleIconAgain.classList.remove("fa-eye");
      toggleIconAgain.classList.add("fa-eye-slash");
    } else {
      senhaInputAgain.setAttribute("type", "password");

      toggleIconAgain.classList.remove("fa-eye-slash");
      toggleIconAgain.classList.add("fa-eye");
    }
  });
}

// ===============================
// FUNÇÃO DE CADASTRO
// ===============================
async function realizarCadastro() {
  const nomeInput = document.getElementById("nome-input");
  const emailInput = document.getElementById("email-input");
  const senhaInput = document.getElementById("password-input");
  const confirmarSenhaInput = document.getElementById("password-again-input");

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();
  const confirmarSenha = confirmarSenhaInput.value.trim();

  let valido = true;

  // limpa erros anteriores
  limparErros();
  limparErroCadastro();

  // valida nome
  if (!nome) {
    marcarErro("nome-input", "Nome é obrigatório");
    valido = false;
  }

  // valida email
  if (!email) {
    marcarErro("email-input", "Email é obrigatório");
    valido = false;
  }

  // valida senha
  if (!senha) {
    marcarErro("password-input", "Senha é obrigatória");
    valido = false;
  }

  // valida confirmação de senha
  if (!confirmarSenha) {
    marcarErro("password-again-input", "Confirme sua senha");
    valido = false;
  } else if (confirmarSenha !== senha) {
    marcarErro("password-input", ""); // só borda vermelha
    marcarErro("password-again-input", "Senhas não coincidem");

    mostrarErroCadastro("Senhas devem ser iguais!");
    valido = false;
  }

  if (!valido) return;

  try {
    const usuarioCriado = await cadastroAPI(nome, email, senha, confirmarSenha);

    // opcional: salvar usuário logado automaticamente
    localStorage.setItem("usuario", JSON.stringify(usuarioCriado));

    window.location.href = "index.html";
  } catch (erro) {
    console.error("Erro no cadastro:", erro);

    // tratamento de erro vindo do backend
    if (erro && typeof erro === "object") {
      if (erro.nome) marcarErro("nome-input", erro.nome);
      if (erro.email) marcarErro("email-input", erro.email);
      if (erro.senha) marcarErro("password-input", erro.senha);
      if (erro.confirmarSenha)
        marcarErro("password-again-input", erro.confirmarSenha);
    } else {
      mostrarErroCadastro("Erro ao criar conta. Verifique os dados.");
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
