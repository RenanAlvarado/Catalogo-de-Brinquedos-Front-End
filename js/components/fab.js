import { isAdmin } from "../services/authService.js";

export function controlarFab() {
  const fab = document.getElementById("fab");

  if (!fab) return;

  fab.onclick = null;

  if (!isAdmin()) {
    fab.style.display = "none";
    return;
  }

  fab.style.display = "flex";

  fab.onclick = () => {
    window.location.href = "adicionar_brinquedo.html";
  };
}
