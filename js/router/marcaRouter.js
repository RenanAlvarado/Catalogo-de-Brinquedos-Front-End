import { isAdmin } from "../services/authService.js";

export function abrirMarca(id) {
  const base = isAdmin() ? "adicionar_marca.html" : "index.html";

  window.location.href = `${base}?id=${id}`;
}
