// ===============================
// CONFIGURAÇÃO DA API --> Arquivo que realiza as chamadas
// ===============================

const API_URL = "http://localhost:8080/api";

// ===============================
// FUNÇÃO GENÉRICA DE REQUISIÇÃO
// ===============================

async function requisicao(endpoint, options = {}) {
  try {
    const headers =
      options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" };

    const resposta = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        ...headers,
        ...options.headers,
      },
      ...options,
    });

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    return await resposta.json();
  } catch (erro) {
    console.error("Erro na requisição da API:", erro);
    return null;
  }
}

// ===============================
// FUNÇÃO AUXILIAR DE IMAGENS
// ===============================

export function obterImagem(pasta, imagem) {
  if (!imagem) return "img/placeholder.png";

  // Puxar imagens
  if (pasta === "toys") {
    return `http://localhost:8080/uploads/toys/${imagem}`;
  }

  // categorias e marcas continuam locais
  return `img/${pasta}/${imagem}`;
}

// ===============================
// CATEGORIAS
// ===============================

export async function buscarCategorias() {
  return await requisicao("/categorias");
}

// ===============================
// MARCAS
// ===============================

export async function buscarMarcas() {
  return await requisicao("/marcas");
}

// ===============================
// ORDENAÇÃO
// ===============================

export async function filtrarBrinquedos({
  categorias,
  marcas,
  page = 0,
  size = 16,
  ordenacao,
}) {
  let url = `/brinquedos/filtrar?page=${page}&size=${size}`;

  if (categorias && categorias.length) {
    url += `&categorias=${categorias.join(",")}`;
  }

  if (marcas && marcas.length) {
    url += `&marcas=${marcas.join(",")}`;
  }

  if (ordenacao) {
    if (ordenacao === "preco-asc") {
      url += "&sort=preco,asc";
    } else if (ordenacao === "preco-desc") {
      url += "&sort=preco,desc";
    } else if (ordenacao === "nome-asc") {
      url += "&sort=nome,asc";
    }
  }

  return await requisicao(url);
}

// ===============================
// CRUD --> BRINQUEDOS
// ===============================

export async function salvarBrinquedoAPI(formData) {
  return await requisicao("/brinquedos", {
    method: "POST",
    body: formData,
  });
}

export async function buscarBrinquedos(page = 0, size = 16) {
  return await requisicao(
    `/brinquedos/listar-paginas?page=${page}&size=${size}`,
  );
}

export async function alterarBrinquedoAPI(id, formData) {
  return await requisicao(`/brinquedos/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deletarBrinquedoAPI(id) {
  return await requisicao(`/brinquedos/${id}`, {
    method: "DELETE",
  });
}

// ===============================
// BUSCA DE BRINQUEDOS POR ID
// ===============================

export async function buscarBrinquedoPorId(id) {
  return await requisicao(`/brinquedos/${id}`);
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

// ===============================
// BUSCA DE BRINQUEDOS POR ID DA MARCA
// ===============================

export async function buscarBrinquedosPorMarca(id) {
  return await requisicao(`/brinquedos/marca/${id}`);
}

// ===============================
// API DE CEP
// ===============================

export async function buscarCEP(cep) {
  const cepLimpo = cep.replace(/\D/g, "");

  const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  const data = await res.json();

  if (data.erro) {
    throw new Error("CEP não encontrado");
  }

  return data;
}
