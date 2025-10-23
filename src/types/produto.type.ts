export interface Produto {
  id: number;
  nomeProduto: string;
  valor: number;
  valorOriginal: number;
  desconto: number;
  descricao: string;
  tipoProduto: number;
  novoLançamento: boolean;
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
