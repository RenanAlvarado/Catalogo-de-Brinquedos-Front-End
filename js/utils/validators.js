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

// Telefone válido (10 dígitos (fixo) ou 11 dígitos (celular))
export function telefoneValido(telefone) {
  const numero = telefone.replace(/\D/g, "");

  // tamanho válido
  if (numero.length !== 10 && numero.length !== 11) return false;

  // DDD
  const ddd = numero.substring(0, 2);

  const dddsValidos = [
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "21",
    "22",
    "24",
    "27",
    "28",
    "31",
    "32",
    "33",
    "34",
    "35",
    "37",
    "38",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "51",
    "53",
    "54",
    "55",
    "61",
    "62",
    "64",
    "63",
    "65",
    "66",
    "67",
    "68",
    "69",
    "71",
    "73",
    "74",
    "75",
    "77",
    "79",
    "81",
    "87",
    "82",
    "83",
    "84",
    "85",
    "88",
    "86",
    "89",
    "91",
    "93",
    "94",
    "92",
    "97",
    "95",
    "96",
    "98",
    "99",
  ];

  if (!dddsValidos.includes(ddd)) return false;

  // regra do celular (11 dígitos)
  if (numero.length === 11) {
    const nonoDigito = numero[2];
    if (nonoDigito !== "9") return false;
  }

  return true;
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
