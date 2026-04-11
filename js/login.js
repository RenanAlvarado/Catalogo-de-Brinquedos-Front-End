// ===============================
// IMPORTS
// ===============================
import { loginAPI } from "./api.js";

// ===============================
// FUNÇÕES AUXILIARES PARA TRATAMENTO DE ERROS
// ===============================
function marcarErro(campo) {
  campo.style.border = "1px solid red";
}

function limparErro(campo) {
  campo.style.border = "1px solid #ccc";
}

function adicionarRemocaoErroTempoReal() {
  const emailInputIcon = document.getElementById("email-input-icon");
  const senhaInputIcon = document.getElementById("password-input-icon");

  emailInputIcon.addEventListener("input", () => {
    limparErro(emailInputIcon);
    limparErroLogin();
  });

  senhaInputIcon.addEventListener("input", () => {
    limparErro(senhaInputIcon);
    limparErroLogin();
  });
}

function mostrarErroLogin(mensagem) {
  const erro = document.getElementById("login-error");

  if (!erro) return;

  erro.textContent = mensagem;
  erro.style.display = "block";
}

function limparErroLogin() {
  const erro = document.getElementById("login-error");

  if (!erro) return;

  erro.textContent = "";
  erro.style.display = "none";
}

// ===============================
// FUNÇÕES DE VISUALIZAR SENHA
// ===============================
function iniciarToggleSenha() {
  const senhaInput = document.getElementById("password-input");
  const toggleIcon = document.getElementById("toggle-password");

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
}

// ===============================
// FUNÇÃO DE LOGIN
// ===============================
async function realizarLogin() {
  const emailInput = document.getElementById("email-input");
  const emailInputIcon = document.getElementById("email-input-icon");
  const senhaInput = document.getElementById("password-input");
  const senhaInputIcon = document.getElementById("password-input-icon");

  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();

  let valido = true;

  // valida email
  if (!email) {
    marcarErro(emailInputIcon);
    valido = false;
  } else {
    limparErro(emailInputIcon);
  }

  // valida senha
  if (!senha) {
    marcarErro(senhaInputIcon);
    valido = false;
  } else {
    limparErro(senhaInputIcon);
  }

  if (!valido) return;

  try {
    const usuario = await loginAPI(email, senha);

    if (!usuario) {
      marcarErro(emailInputIcon);
      marcarErro(senhaInputIcon);

      mostrarErroLogin("Email ou senha incorretos");
      return;
    }

    // Local Storage: BD do navegador, fica salvo durante a sessão
    localStorage.setItem("usuario", JSON.stringify(usuario));

    if (usuario.tipo === "ADMIN") {
      window.location.href = "index.html";
    } else {
      window.location.href = "index.html";
    }
  } catch (erro) {
    console.error("Erro no login:", erro);

    marcarErro(emailInput);
    marcarErro(senhaInput);
  }
}
// ===============================
// EVENTO DO FORM (FORMA CORRETA)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  if (!form) {
    console.error("Formulário não encontrado");
    return;
  }

  iniciarToggleSenha();
  adicionarRemocaoErroTempoReal();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    realizarLogin();
  });
});
