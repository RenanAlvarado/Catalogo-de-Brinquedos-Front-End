// ===============================
// CART SERVICE
// ===============================

const CART_KEY = "carrinho";

/**
 * Busca carrinho do localStorage
 */
export function getCarrinho() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

/**
 * Salva carrinho no localStorage
 */
function salvarCarrinho(carrinho) {
  localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
}

/**
 * Adiciona produto ao carrinho
 */
export function adicionarAoCarrinho(produto) {
  const carrinho = getCarrinho();

  const produtoNormalizado = {
    id: Number(produto.id), //  SEMPRE NUMBER
    nome: produto.nome,
    preco: Number(produto.preco) || 0, //  nunca null
    imagem: produto.imagem,
    marca: produto.marca?.nome || produto.marca || "",
    quantidade: 1,
  };

  const itemExistente = carrinho.find(
    (item) => Number(item.id) === produtoNormalizado.id,
  );

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push(produtoNormalizado);
  }

  salvarCarrinho(carrinho);
}

/**
 * Remove item do carrinho
 */
export function removerDoCarrinho(id) {
  const carrinho = getCarrinho().filter(
    (item) => Number(item.id) !== Number(id),
  );

  salvarCarrinho(carrinho);
}

/**
 * Altera quantidade (+ ou -)
 */
export function alterarQuantidade(id, delta) {
  const carrinho = getCarrinho();

  const item = carrinho.find((i) => Number(i.id) === Number(id));
  if (!item) return;

  item.quantidade += delta;

  if (item.quantidade <= 0) {
    salvarCarrinho(carrinho.filter((i) => Number(i.id) !== Number(id)));
    return;
  }

  salvarCarrinho(carrinho);
}

/**
 * Limpa carrinho inteiro
 */
export function limparCarrinho() {
  localStorage.removeItem(CART_KEY);
}

/**
 * Calcula subtotal (sem frete)
 */
export function calcularSubtotal() {
  const carrinho = getCarrinho();

  return carrinho.reduce((total, item) => {
    return total + item.preco * item.quantidade;
  }, 0);
}

/**
 * Quantidade total de itens
 */
export function contarItens() {
  const carrinho = getCarrinho();

  return carrinho.reduce((total, item) => total + item.quantidade, 0);
}

/**
 * Retorna carrinho formatado (caso queira evoluir depois)
 */
export function obterCarrinho() {
  return getCarrinho();
}
