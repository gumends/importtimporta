import { ModelosOption, Produto } from "@/types/produto.type";

export async function getProduto(id: number): Promise<Produto | undefined> {
  const produtosData = (await import("./produtos.json")).default;
  return produtosData.find((p) => p.id === id);
}

export async function getProdutosPorProdutoIdEModeloId(
  produtoId: number,
  modeloId: number
): Promise<Produto | undefined> {
  const produtosData = (await import("./produtos.json")).default;

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

export async function buscaProdutosPorNome(nome: string): Promise<Produto[]> {
  const produtosData: Produto[] = (await import("./produtos.json")).default;

  // Remove espaços extras e converte tudo pra minúsculas
  const termo = nome.trim().toLowerCase();

  // Se o campo estiver vazio, retorna lista vazia
  if (!termo) return [];

  // Busca parcial (contém em qualquer parte do nome)
  const produtosFiltrados = produtosData.filter((p) =>
    p.nomeProduto.toLowerCase().includes(termo)
  );

  return produtosFiltrados;
}