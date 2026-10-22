export function formatarPreco(preco) {
  return `${Number(preco).toFixed(2).replace(".", ",")}`;
}
