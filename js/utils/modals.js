// ===============================
// CONFIRMAÇÃO POR MODAL
// ===============================
export function confirmarAcao(mensagem) {
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
export function mostrarFeedbackAcao(tipo, mensagem) {
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
