// ===============================
// ARQUIVO PARA VALIDAÇÕES DO BACKEND
// ===============================

// ===============================
// Cadastro do Usuário
// ===============================

export function marcarErro(id, mensagem) {
  const input = document.getElementById(id);

  if (!input) return;

  input.classList.add("input-error");

  let erro = input.parentElement.querySelector(".erro-texto");

  if (!erro) {
    erro = document.createElement("small");
    erro.classList.add("erro-texto");
    input.parentElement.appendChild(erro);
  }

  erro.textContent = mensagem;
}

export function limparErros() {
  const campos = document.querySelectorAll(".input-error");

  campos.forEach((campo) => {
    campo.classList.remove("input-error");
  });

  const mensagens = document.querySelectorAll(".erro-texto");

  mensagens.forEach((msg) => msg.remove());
}

// Remoção de erros ao digitar
export function adicionarRemocaoErroTempoReal() {
  const inputs = document.querySelectorAll(".input-icon input");

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("input-error");

      const erro = input.parentElement.querySelector(".erro-texto");
      if (erro) erro.remove();
    });
  });
}

export function mostrarErroGeral(id, mensagem) {
  const erro = document.getElementById(id);
  if (!erro) return;

  erro.textContent = mensagem;
  erro.style.display = "block";
}

export function limparErroGeral(id) {
  const erro = document.getElementById(id);
  if (!erro) return;

  erro.textContent = "";
  erro.style.display = "none";
}
