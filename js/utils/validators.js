// ARQUIVO PARA VALIDAÇÃO DOS INPUTS

export function cepValido(cep) {
  return /^\d{5}-\d{3}$/.test(cep);
}

export function campoVazio(valor) {
  return !valor || valor.trim() === "";
}

export function normalizarPreco(valor) {
  return parseFloat(valor.replace(/\./g, "").replace(",", "."));
}

export function selectNaoSelecionado(valor) {
  return !valor || valor === "";
}
