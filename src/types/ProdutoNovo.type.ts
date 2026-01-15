export interface Produto {
  id: number;
  nomeProduto: string;
  valor?: number;
  valorOriginal: number;
  valorParcelado: number;
  desconto: number;
  descricao: string;
  tipoProduto: number;
  novoLancamento: boolean;
  novaGeracao?: boolean;
  disponivel: boolean;
  mesesGarantia: number;
  informacoesAdicionais: Informacoes | null;
  informacoesAdicionaisId?: number;
  quantidade: number;
  color: string;
  colorName: string;
  imagens: IImagem[] | null;
}

export interface Informacoes {
  id?: number;
  marca: string;
  armazenamentoInterno: string | null;
  tipoTela: string | null;
  tamanhoTela: string | null;
  resolucaoTela: string | null;
  tecnologia: string | null;
  processador: string | null;
  sistemaOperacional: string | null;
  cameraTraseira: string | null;
  cameraFrontal: string | null;
  bateria: string | null;
  quantidadeChips: string | null;
  material: string | null;
}

export interface IImagem {
  caminho: string;
  descricao: string;
  produtoId: number;
}

export interface ProdutosResponse {
  itens: Produto[];
  paginaAtual: number;
  tamanhoPagina: number;
  totalItens: number;
  totalPaginas: number;
}
