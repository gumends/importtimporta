import { ColorOption, Colors } from "@/types/cores.type";
import { Produto } from "@/types/produto.type";
import { ModelosOption, ProdutoAtual } from "@/types/produtoAtual.type";
import { ProdutoPaginados } from "@/types/produtosPaginados";

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

export async function getprodutosAleatorios() {
  const produtosData: Produto[] = (await import("./produtos.json")).default;

  const produtosAleatorios = produtosData
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return produtosAleatorios;
}

export async function getProdutosPromocoes(
  pagina: number = 1,
  limite: number = 2
): Promise<ProdutoPaginados> {
  const produtosData: Produto[] = (await import("./produtos.json")).default;

  const produtosComDesconto = produtosData.filter(
    (p) => p.desconto != null && p.desconto > 0
  );

  const totalItens = produtosComDesconto.length;
  const totalPaginas = Math.ceil(totalItens / limite);

  const inicio = (pagina - 1) * limite;
  const fim = inicio + limite;

  const produtosPaginados = produtosComDesconto.slice(inicio, fim);

  return {
    produtos: produtosPaginados,
    totalPaginas,
    paginaAtual: pagina,
  };
}


export async function buscaProdutosPorNome(nome: string): Promise<Produto[]> {
  const produtosData: Produto[] = (await import("./produtos.json")).default;

  const termo = nome.trim().toLowerCase();

  if (!termo) return [];

  const produtosFiltrados = produtosData.filter((p) =>
    p.nomeProduto.toLowerCase().includes(termo)
  );

  return produtosFiltrados;
}

export async function buscaProduto(
  idProduto: number
): Promise<Produto | undefined> {
  const produtosData: Produto[] = (await import("./produtos.json")).default;

  if (!produtosData || produtosData.length === 0) return undefined;

  const produto = produtosData.find((pr) => pr.id === idProduto);

  return produto;
}

export async function buscaTipoProduto(
  tipoProduto: number,
  pagina: number = 1,
  limite: number = 8
): Promise<ProdutoPaginados> {
  const produtosData: Produto[] = (await import("./produtos.json")).default;

  if (!produtosData || produtosData.length === 0) {
    return { produtos: [], totalPaginas: 0, paginaAtual: pagina };
  }

  const produtosFiltrados = produtosData.filter(
    (pr) => pr.tipoProduto === tipoProduto
  );

  const totalItens = produtosFiltrados.length;
  const totalPaginas = Math.ceil(totalItens / limite);

  const inicio = (pagina - 1) * limite;
  const fim = inicio + limite;

  const produtosPaginados = produtosFiltrados.slice(inicio, fim);

  return {
    produtos: produtosPaginados,
    totalPaginas,
    paginaAtual: pagina,
  };
}
