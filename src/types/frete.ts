export interface CotarFreteItemRequest {
  idProduto?: string;
  quantidade: number;
  tipoProduto?: number;
  valorUnitario?: number;
}

export interface OpcaoFrete {
  codigo: string;
  nome: string;
  valor: number;
  prazoMinDias: number;
  prazoMaxDias: number;
}

export interface CotarFreteResponse {
  cepDestino: string;
  opcoes: OpcaoFrete[];
  opcaoSelecionada?: string;
  valorSelecionado: number;
  prazoMinDias: number;
  prazoMaxDias: number;
  estimativa: boolean;
}

export interface FreteSelecionadoStorage {
  cep: string;
  opcaoCodigo: string;
  valor: number;
  prazoMinDias: number;
  prazoMaxDias: number;
  estimativa: boolean;
}
