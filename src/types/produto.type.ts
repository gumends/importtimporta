export interface Produto {
  id: string;
  nomeProduto: string;
  valorOriginal: number;
  desconto: number;
  valor: number;
  valorParcelado: number;
  descricao: string;
  tipoProduto: number;
  disponivel: boolean;
  mesesGarantia: number;
  quantidade: number;
  color: string;
  colorName: string;
  informacoesProdutoId?: number;
  informacoesProduto: Informacoes;
}

export interface Informacoes {
  id: string;
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