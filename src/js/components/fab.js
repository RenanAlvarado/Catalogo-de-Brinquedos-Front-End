import { isAdmin } from "../services/authService.js";

export function controlarFab() {
  const fab = document.getElementById("fab");
  const fabOptions = document.getElementById("fab-options");
  const fabContainer = document.getElementById("fab-container");

  if (!fab || !fabOptions || !fabContainer) return;

  if (!isAdmin()) {
    fabContainer.style.display = "none";
    return;
  }

  fabContainer.style.display = "block";

  // toggle submenu
  fab.onclick = (e) => {
    e.stopPropagation();
    fabOptions.classList.toggle("active");
  };

  // clique nos itens
  document.querySelectorAll(".fab-item").forEach((item) => {
    item.addEventListener("click", () => {
      const link = item.dataset.link;
      window.location.href = link;
    });
  });

  // fechar ao clicar fora
  document.addEventListener("click", (e) => {
    if (!fabContainer.contains(e.target)) {
      fabOptions.classList.remove("active");
    }
  });
}
