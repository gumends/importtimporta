interface InformacoesAdicionais {
  marca: string;
  armazenamentoInterno: string;
  tipoTela: string;
  tamanhoTela: string;
  resolucaoTela: string;
  tecnologia: string;
  processador: string;
  sistemaOperacional: string;
  cameraTraseira: string;
  cameraFrontal: string;
  bateria: string;
  quantidadeChips: string;
  material: string;
}

interface FormularioProduto {
  nomeProduto: string;
  valorOriginal: string;
  desconto: string;
  valorParcelado: string;
  descricao: string;
  tipoProduto: number;
  disponivel: boolean;
  mesesGarantia: string;
  quantidade: string;
  color: string;
  colorName: string;
  informacoesProduto: InformacoesAdicionais;
}

