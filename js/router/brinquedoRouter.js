import { isAdmin } from "../services/authService.js";

export function abrirBrinquedo(id) {
  const base = isAdmin()
    ? "adicionar_brinquedo.html"
    : "detalhes_brinquedo.html";

  // pega os params atuais da URL (da página index)
  const params = new URLSearchParams(window.location.search);

  const search = params.get("search");
  const marca = params.get("marca");

  let url = `${base}?id=${id}`;

  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (marca) url += `&marca=${marca}`;

  //  salva o scroll antes de sair
  sessionStorage.setItem("scrollPosition", window.scrollY);

  window.location.href = url;
}
