// ===============================
// AUTH SERVICE
// ===============================

export function getUsuario() {
  return JSON.parse(localStorage.getItem("usuario"));
}

export function isLogged() {
  return !!getUsuario();
}

export function isAdmin() {
  const usuario = getUsuario();
  return usuario?.tipo === "ADMIN";
}

export function logout() {
  localStorage.removeItem("usuario");
  localStorage.removeItem("carrinho");
}
