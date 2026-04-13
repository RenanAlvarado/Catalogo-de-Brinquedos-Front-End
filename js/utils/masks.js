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

// Máscara para preço (R$)
export function aplicarMascaraPreco(valor) {
  // remove tudo que não for número
  valor = valor.replace(/\D/g, "");

  // evita vazio
  if (valor === "") return "";

  // transforma em número e divide por 100
  valor = (parseInt(valor) / 100).toFixed(2);

  // troca ponto por vírgula
  valor = valor.replace(".", ",");

  // adiciona separador de milhar
  valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return valor;
}

// Máscara para o telefone
export function aplicarMascaraTelefone(valor) {
  valor = valor.replace(/\D/g, "");

  if (valor.length <= 10) {
    // Telefone fixo: (11) 1234-5678
    valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
    valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    // Celular: (11) 91234-5678
    valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
  }

  return valor;
}
