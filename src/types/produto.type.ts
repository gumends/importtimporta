export interface Produto {
  id: number;
  nomeProduto: string;
  image: string;
  precoComDesconto: string | null;
  precoSemDesconto: string | null;
  descricao: string;
  novaGeracao?: boolean;
  colors?: string[] | null;
}

export interface Produtos {
  produtos: Produto[];
}