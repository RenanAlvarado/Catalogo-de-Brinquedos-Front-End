// ===============================
// CONFIGURAÇÃO DA API --> Arquivo que realiza as chamadas
// ===============================

const API_URL = "http://localhost:8080/api";

// ===============================
// FUNÇÃO GENÉRICA DE REQUISIÇÃO
// ===============================

async function requisicao(endpoint) {
  try {
    const resposta = await fetch(`${API_URL}${endpoint}`);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    return await resposta.json();
  } catch (erro) {
    console.error("Erro na requisição da API:", erro);
    return [];
  }
}

// ===============================
// CATEGORIAS
// ===============================

export async function buscarCategorias() {
  return await requisicao("/categorias");
}

// ===============================
// BRINQUEDOS
// ===============================

export async function buscarBrinquedos() {
  return await requisicao("/brinquedos");
}

// ===============================
// BUSCA DE BRINQUEDOS POR NOME
// ===============================

export async function buscarBrinquedosPorNome(nome) {
  return await requisicao(`/brinquedos/contem-nome/${nome}`);
}

// ===============================
// BUSCA DE BRINQUEDOS POR ID DA CATEGORIA
// ===============================

export async function buscarBrinquedosPorCategoria(id) {
  return await requisicao(`/brinquedos/categoria/${id}`);
}
