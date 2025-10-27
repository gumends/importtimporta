export interface ProdutoAtual {
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
  modelos?: ModelosOption[];
  disponivel: boolean;
  mesesGarantia: number
  informacoesAdicionais: InformacoesAtual | null;
}

export interface InformacoesAtual {
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

export interface ProdutosAtual {
  produtos: ProdutoAtual[];
}

export interface ModelosOption {
  id: number
  color: string;
  image: string;
  colorName: string;
  idProduto: number;
}
