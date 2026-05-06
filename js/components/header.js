import { contarItens } from "../services/cartService.js";

export function inicializarHeaderUsuario() {
  if (!usuario) {
    localStorage.removeItem("carrinho"); // limpa automaticamente
  }

  atualizarTextoCarrinho();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const botao = document.getElementById("login-btn");
  const texto = document.getElementById("login-text");

  const cartBtn = document.getElementById("cart");

  if (!botao || !texto) return;

  function renderizarUsuario() {
    botao.classList.add("logout");

    texto.innerHTML = `Olá, ${usuario.nome} <i class="fa-solid fa-right-from-bracket"></i>  `;

    botao.onclick = () => {
      // LOGOUT
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");

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

  // ===============================
  //  CARRINHO (NOVO)
  // ===============================
  if (cartBtn) {
    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (usuario) {
        window.location.href = "carrinho.html";
      } else {
        window.location.href = "perfil.html";
      }
    });
  }

  // estado inicial
  if (usuario) {
    renderizarUsuario();
  } else {
    renderizarVisitante();
  }
}

export function atualizarTextoCarrinho() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const cartBtn = document.getElementById("cart");

  if (!cartBtn) return;

  //  ADMIN NÃO VÊ CARRINHO
  if (usuario?.tipo === "ADMIN") {
    cartBtn.style.display = "none";
    return;
  }

  if (!usuario) {
    // só ícone, sem contador
    cartBtn.innerHTML = `Carrinho<i class="fa-solid fa-cart-shopping"></i>`;
    return;
  }

  const total = contarItens();

  if (total > 0) {
    cartBtn.innerHTML = `Carrinho
      <i class="fa-solid fa-cart-shopping"></i>
      <span class="cart-count">(${total})</span>
    `;
  } else {
    cartBtn.innerHTML = `Carrinho <i class="fa-solid fa-cart-shopping"></i>`;
  }
}
