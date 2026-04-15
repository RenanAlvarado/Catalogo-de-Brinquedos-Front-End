// ===============================
// MARCAR ERRO
// ===============================
export function marcarErro(id, mensagem) {
  const campo = document.getElementById(id);
  if (!campo) return;

  campo.classList.add("input-error");

  let erro = campo.nextElementSibling;

  // se o próximo NÃO for erro, cria
  if (!erro || !erro.classList.contains("erro-texto")) {
    erro = document.createElement("small");
    erro.classList.add("erro-texto");

    campo.insertAdjacentElement("afterend", erro);
  }

  erro.textContent = mensagem;
}

// ===============================
// LIMPAR ERROS
// ===============================
export function limparErros() {
  const campos = document.querySelectorAll("input, textarea, select");

  campos.forEach((campo) => {
    campo.classList.remove("input-error");

    const erro = campo.nextElementSibling;

    if (erro && erro.classList.contains("erro-texto")) {
      erro.remove();
    }
  });
}

// ===============================
// REMOÇÃO DE ERRO EM TEMPO REAL
// ===============================
export function adicionarRemocaoErroTempoReal() {
  const campos = document.querySelectorAll("input, textarea, select");

  campos.forEach((campo) => {
    const evento = campo.tagName === "SELECT" ? "change" : "input";

    campo.addEventListener(evento, () => {
      campo.classList.remove("input-error");

      const erro = campo.nextElementSibling;

      // 🔥 remove só o erro daquele campo
      if (erro && erro.classList.contains("erro-texto")) {
        erro.remove();
      }
    });
  });
}

// ===============================
// ERRO GERAL
// ===============================
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
