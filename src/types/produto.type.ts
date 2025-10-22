export interface Produto {
  id: number;
  nomeProduto: string;
  precoComDesconto: string | null;
  precoSemDesconto: string | null;
  descricao: string;
  novaGeracao?: boolean;
  modelos?: ModelosOption[];
}

export interface Produtos {
  produtos: Produto[];
}

export interface ModelosOption {
  color: string;
  image: string;
  colorName: string;
}