// ===============================
// IMPORTS
// ===============================
import { loginAPI } from "../api.js";

import {
  marcarErro,
  limparErros,
  adicionarRemocaoErroTempoReal,
  mostrarErroGeral,
  limparErroGeral,
} from "../utils/formUtils.js";

import { campoVazio, emailValido } from "../utils/validators.js";

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
      toggleIcon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      senhaInput.setAttribute("type", "password");
      toggleIcon.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
}

// ===============================
// FUNÇÃO DE LOGIN
// ===============================
async function realizarLogin() {
  const email = document.getElementById("email-input").value.trim();
  const senha = document.getElementById("password-input").value.trim();

  let valido = true;

  // limpa erros anteriores
  limparErros();
  limparErroGeral("login-error");

  // ===============================
  // VALIDAÇÕES
  // ===============================

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
  }

  if (!valido) return;

  // ===============================
  // CHAMADA API
  // ===============================
  try {
    const data = await loginAPI(email, senha);

    // salvar token separado
    localStorage.setItem("token", data.token);

    // salvar usuário separado
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    window.location.href = "index.html";
  } catch (erro) {
    console.error("Erro no login:", erro);

    // erro de validação do backend (400)
    if (Array.isArray(erro)) {
      erro.forEach((msg) => {
        if (msg.toLowerCase().includes("email")) {
          marcarErro("email-input", msg);
        } else if (msg.toLowerCase().includes("senha")) {
          marcarErro("password-input", msg);
        }
      });

      return;
    }

    // erro de login (401)
    marcarErro("email-input", "");
    marcarErro("password-input", "");

    mostrarErroGeral("login-error", "Email ou senha incorretos");
  }
}

// ===============================
// EVENTO DO FORM
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
