// ARQUIVO PARA VALIDAÇÃO DOS INPUTS

export function cepValido(cep) {
  return /^\d{5}-\d{3}$/.test(cep);
}
