import { isAdmin } from "../services/authService.js";

export function abrirCategoria(id) {
  const base = isAdmin() ? "adicionar_categoria.html" : "index.html";

  window.location.href = `${base}?id=${id}`;
}
