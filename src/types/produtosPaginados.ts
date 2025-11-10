export interface Produtos {
  id: number;
  nomeProduto: string;
  valor: number;
  valorOriginal: number;
  valorParcelado: number;
  desconto: number;
  descricao: string;
  tipoProduto: number;
  novoLançamento: boolean;
  novaGeracao?: boolean;
  disponivel: boolean;
  mesesGarantia: number;
  informacoesAdicionais: Informacoes | null;
  color: string;
  colorName: string;
  imagem: string;
  imagens: IIMagens[] | null;
  totalPaginas?: number;
}

export interface Informacoes {
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

export interface ProdutoPaginados {
  produtos: Produtos[];
  totalPaginas: number;
  paginaAtual: number;
}

export interface IIMagens {
  caminho: string;
}