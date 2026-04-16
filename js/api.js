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

    if (resposta.status === 204) {
      return null;
    }

    if (!resposta.ok) {
      const erroData = await resposta.json();
      throw erroData;
    }

    return await resposta.json();
  } catch (erro) {
    console.error("Erro na requisição da API:", erro);
    throw erro;
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

  if (pasta === "usuarios") {
    return `http://localhost:8080/uploads/usuarios/${imagem}`;
  }

  if (pasta === "categories") {
    return `http://localhost:8080/uploads/categories/${imagem}`;
  }

  if (pasta === "brands") {
    return `http://localhost:8080/uploads/brands/${imagem}`;
  }
}

// ===============================
// CRUD USUÁRIO
// ===============================

export async function buscarUsuarioPorId(id) {
  return await requisicao(`/usuarios/${id}`);
}

export async function alterarUsuarioAPI(id, dados) {
  return await requisicao(`/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

export async function atualizarImagemUsuarioAPI(id, formData) {
  return await requisicao(`/usuarios/${id}/imagem`, {
    method: "PUT",
    body: formData,
  });
}

// ===============================
// SISTEMA DE LOGIN E CADASTRO
// ===============================

export async function loginAPI(email, senha) {
  return await requisicao("/usuarios/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

export async function cadastroAPI(nome, email, senha, confirmarSenha) {
  return await requisicao("/usuarios/cadastro", {
    method: "POST",
    body: JSON.stringify({ nome, email, senha, confirmarSenha }),
  });
}

// ===============================
// CATEGORIAS
// ===============================

export async function buscarCategorias() {
  return await requisicao("/categorias");
}

export async function buscarCategoriaPorId(id) {
  return await requisicao(`/categorias/${id}`);
}

// ===============================
// CRUD --> CATEGORIAS
// ===============================

export async function salvarCategoriaAPI(formData) {
  return await requisicao("/categorias", {
    method: "POST",
    body: formData,
  });
}

export async function alterarCategoriaAPI(id, formData) {
  return await requisicao(`/categorias/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deletarCategoriaAPI(id) {
  return await requisicao(`/categorias/${id}`, {
    method: "DELETE",
  });
}

// ===============================
// MARCAS
// ===============================

export async function buscarMarcas() {
  return await requisicao("/marcas");
}

export async function buscarMarcaPorId(id) {
  return await requisicao(`/marcas/${id}`);
}

// ===============================
// CRUD --> MARCAS
// ===============================

export async function salvarMarcaAPI(formData) {
  return await requisicao("/marcas", {
    method: "POST",
    body: formData,
  });
}

export async function alterarMarcaAPI(id, formData) {
  return await requisicao(`/marcas/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deletarMarcaAPI(id) {
  return await requisicao(`/marcas/${id}`, {
    method: "DELETE",
  });
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
  search, // 🔥 NOVO
}) {
  let url = `/brinquedos/filtrar?page=${page}&size=${size}`;

  // ===============================
  // CATEGORIAS (FORMATO CORRETO)
  // ===============================
  if (categorias && categorias.length) {
    categorias.forEach((id) => {
      url += `&categorias=${id}`;
    });
  }

  // ===============================
  // MARCAS (FORMATO CORRETO)
  // ===============================
  if (marcas && marcas.length) {
    marcas.forEach((id) => {
      url += `&marcas=${id}`;
    });
  }

  // ===============================
  // 🔥 SEARCH (ESSENCIAL)
  // ===============================
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  // ===============================
  // ORDENAÇÃO
  // ===============================
  if (ordenacao === "preco-asc") {
    url += "&sort=preco,asc";
  } else if (ordenacao === "preco-desc") {
    url += "&sort=preco,desc";
  } else if (ordenacao === "nome-asc") {
    url += "&sort=nome,asc";
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
// BUSCA DE MARCAS POR NOME
// ===============================

export async function buscarMarcasPorNome(nome) {
  return await requisicao(`/marcas/contem-nome/${nome}`);
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
