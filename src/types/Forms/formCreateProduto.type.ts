interface InformacoesAdicionais {
  id: number;
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
  id: number;
  nomeProduto: string;
  valorOriginal: string;
  valorParcelado: string;
  desconto: string;
  descricao: string;
  tipoProduto: string; // 👈 string
  novoLancamento: boolean;
  novaGeracao: boolean;
  disponivel: boolean;
  mesesGarantia: string;
  informacoesAdicionais: InformacoesAdicionais;
  informacoesAdicionaisId: number;
  color: string;
  colorName: string;
}

