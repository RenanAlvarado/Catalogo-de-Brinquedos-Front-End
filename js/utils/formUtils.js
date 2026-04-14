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
