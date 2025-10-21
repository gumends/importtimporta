import { Produto } from "@/types/produto.type";

export async function getProduto(id: number): Promise<Produto | undefined> {
  const produtosData = (await import("./produtos.json")).default;
  return produtosData.find(p => p.id === id);
}

export async function getProdutosNovaGeracao(): Promise<Produto[] | undefined> {
  const produtosData = (await import("./produtos.json")).default;
  return produtosData.filter(p => p.novaGeracao === true);
}