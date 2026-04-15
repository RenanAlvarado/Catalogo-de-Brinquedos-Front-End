// ===============================
// VALIDAÇÕES GENÉRICAS (SEM DOM)
// ===============================

// Campo vazio
export function campoVazio(valor) {
  return !valor || valor.trim() === "";
}

// Email válido
export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Nome completo (mínimo 2 palavras)
export function nomeCompletoValido(nome) {
  return /^[A-Za-zÀ-ÿ]+(\s+[A-Za-zÀ-ÿ]+)+$/.test(nome);
}

// Senha mínima (6 caracteres)
export function senhaMinimaValida(senha) {
  return senha && senha.length >= 6;
}

// Senhas iguais
export function senhasIguais(senha, confirmarSenha) {
  return senha === confirmarSenha;
}

// CEP válido (formato 00000-000)
export function cepValido(cep) {
  return /^\d{5}-\d{3}$/.test(cep);
}

// Apenas números
export function apenasNumeros(valor) {
  return /^\d+$/.test(valor);
}

// Select não selecionado
export function selectNaoSelecionado(valor) {
  return !valor || valor === "";
}

// Preço válido (maior que 0)
export function precoValido(valor) {
  const numero = normalizarPreco(valor);
  return !isNaN(numero) && numero > 0;
}

// Converter preço BR → float
export function normalizarPreco(valor) {
  if (!valor) return 0;
  return parseFloat(valor.replace(/\./g, "").replace(",", "."));
}
