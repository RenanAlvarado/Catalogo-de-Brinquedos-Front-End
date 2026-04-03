// ARQUIVO PARA MÁSCARAS DE INPUTS

// Máscara para o CEP
export function aplicarMascaraCEP(valor) {
  valor = valor.replace(/\D/g, "");
  valor = valor.substring(0, 8);

  if (valor.length > 5) {
    valor = valor.replace(/(\d{5})(\d+)/, "$1-$2");
  }

  return valor;
}
