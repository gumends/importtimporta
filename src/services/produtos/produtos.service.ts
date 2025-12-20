import { ModelosOption, ProdutoAtual } from "@/types/produtoAtual.type";
import _ from "lodash";

export async function getProduto(
  id: number
): Promise<ProdutoAtual | undefined> {
  const produtosData = (await import("./ProtudoAtual.json")).default;
  return produtosData.find((p) => p.id === id);
}

export async function getProdutosPorProdutoIdEModeloId(
  produtoId: number,
  modeloId: number
): Promise<ProdutoAtual | undefined> {
  const produtosData = (await import("./ProtudoAtual.json")).default;

  const produto = produtosData.find((p) => p.id === produtoId);
  if (!produto) return undefined;

  const coresOrdenadas = [...produto.modelos].sort((a, b) => {
    if (a.id === modeloId) return -1;
    if (b.id === modeloId) return 1;
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
  const produtosData = (await import("./ProtudoAtual.json")).default;
  const cores = produtosData.find((p) => p.id === id)?.modelos ?? [];
  return cores;
}

export async function getProdutosNovaGeracao(): Promise<
  ProdutoAtual[] | undefined
> {
  const produtosData: ProdutoAtual[] = (await import("./ProtudoAtual.json"))
    .default;
  const produtos = produtosData.filter((p) => p.novaGeracao === true);
  return produtos ?? [];
}

