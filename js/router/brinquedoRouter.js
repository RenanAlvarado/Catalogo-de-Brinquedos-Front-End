import { isAdmin } from "../services/authService.js";

export function abrirBrinquedo(id) {
  const base = isAdmin()
    ? "adicionar_brinquedo.html"
    : "detalhes_brinquedo.html";

  const params = new URLSearchParams(window.location.search);

  // salva scroll
  sessionStorage.setItem("scrollPosition", window.scrollY);

  window.location.href = `${base}?id=${id}&${params.toString()}`;
}
