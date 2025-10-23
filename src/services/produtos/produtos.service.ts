import { ModelosOption, Produto } from "@/types/produto.type";

export async function getProduto(id: number): Promise<Produto | undefined> {
  const produtosData = (await import("./produtos.json")).default;
  return produtosData.find((p) => p.id === id);
}

export async function getProdutosPorIdECor(
  id: number,
  cor: string
): Promise<Produto | undefined> {
  const produtosData = (await import("./produtos.json")).default;

  const produto = produtosData.find((p) => p.id === id);
  if (!produto) return undefined;

  const coresOrdenadas = [...produto.modelos].sort((a, b) => {
    if (a.color === cor) return -1;
    if (b.color === cor) return 1;
    return 0;
  });

  return {
    ...produto,
    modelos: coresOrdenadas,
  };
}

export async function getCoresProduto(
  id: number
): Promise<ModelosOption[] | undefined> {
  const produtosData = (await import("./produtos.json")).default;
  const cores = produtosData.find((p) => p.id === id)?.modelos ?? [];
  return cores;
}

export async function getProdutosNovaGeracao(): Promise<Produto[] | undefined> {
  const produtosData: Produto[] = (await import("./produtos.json")).default;
  const produtos = produtosData.filter((p) => p.novaGeracao === true);
  return produtos ?? [];
}

export async function getprodutosAleatorios() {
  const produtosData: Produto[] = (await import("./produtos.json")).default;
  
  const produtosAleatorios = produtosData
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return produtosAleatorios;
}

export async function getProdutosPromocoes() {
  const produtosData: Produto[] = (await import("./produtos.json")).default;
  const produtosComDesconto = produtosData.filter((p) => (
    p.desconto > 0 || p.desconto != null
  ))
  return produtosComDesconto;
}