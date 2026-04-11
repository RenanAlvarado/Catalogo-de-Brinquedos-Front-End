export function inicializarHeaderUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const botao = document.getElementById("login-btn");
  const texto = document.getElementById("login-text");

  if (!botao || !texto) return;

  function renderizarUsuario() {
    botao.classList.add("logout");

    texto.innerHTML = `Olá, ${usuario.nome} <i class="fa-solid fa-right-from-bracket"></i>  `;

    botao.onclick = () => {
      // LOGOUT
      localStorage.removeItem("usuario");

      // recarrega a página
      window.location.reload();

      // reset visual
      botao.classList.remove("logout");

      renderizarVisitante();
    };
  }

  function renderizarVisitante() {
    texto.innerHTML = `Cadastro/Login <i class="fa-regular fa-user"></i>`;

    botao.onclick = () => {
      window.location.href = "login.html";
    };
  }

  // estado inicial
  if (usuario) {
    renderizarUsuario();
  } else {
    renderizarVisitante();
  }
}
