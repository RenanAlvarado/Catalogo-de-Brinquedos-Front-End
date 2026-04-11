import { isAdmin } from "../services/authService.js";

export function abrirBrinquedo(id) {
  const base = isAdmin()
    ? "adicionar_brinquedo.html"
    : "detalhes_brinquedo.html";

  window.location.href = `${base}?id=${id}`;
}
