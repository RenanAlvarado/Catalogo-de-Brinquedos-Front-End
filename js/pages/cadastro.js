// ===============================
// IMPORTS
// ===============================
import { cadastroAPI } from "../api.js";

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
  const nomeInputIcon = document.getElementById("nome-input-icon");
  const emailInputIcon = document.getElementById("email-input-icon");
  const senhaInputIcon = document.getElementById("password-input-icon");
  const senhaAgainInputIcon = document.getElementById(
    "password-again-input-icon",
  );

  nomeInputIcon.addEventListener("input", () => {
    limparErro(nomeInputIcon);
  });

  emailInputIcon.addEventListener("input", () => {
    limparErro(emailInputIcon);
  });

  senhaInputIcon.addEventListener("input", () => {
    limparErro(senhaInputIcon);

    limparErroCadastro();
  });

  senhaAgainInputIcon.addEventListener("input", () => {
    limparErro(senhaInputIcon);
    limparErroCadastro();
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

  const nomeInputIcon = document.getElementById("nome-input-icon");
  const emailInputIcon = document.getElementById("email-input-icon");
  const senhaInputIcon = document.getElementById("password-input-icon");
  const senhaAgainInputIcon = document.getElementById(
    "password-again-input-icon",
  );

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();
  const confirmarSenha = confirmarSenhaInput.value.trim();

  let valido = true;

  // valida nome
  if (!nome) {
    marcarErro(nomeInputIcon);
    valido = false;
  } else {
    limparErro(nomeInputIcon);
  }

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

  if (confirmarSenha !== senha) {
    mostrarErroCadastro("Senhas devem ser iguais!");
  }

  // valida confirmação de senha
  if (!confirmarSenha || confirmarSenha !== senha) {
    marcarErro(senhaAgainInputIcon);
    valido = false;
  } else {
    limparErro(senhaAgainInputIcon);
  }

  if (!valido) return;

  try {
    const usuarioCriado = await cadastroAPI(nome, email, senha);

    // opcional: salvar usuário logado automaticamente
    localStorage.setItem("usuario", JSON.stringify(usuarioCriado));

    window.location.href = "index.html";
  } catch (erro) {
    console.error("Erro no cadastro:", erro);

    alert("Erro ao criar conta. Verifique os dados.");
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
