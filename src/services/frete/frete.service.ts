import {
  CotarFreteItemRequest,
  CotarFreteResponse,
  FreteSelecionadoStorage,
} from "@/types/frete";

export const FRETE_STORAGE_KEY = "frete_selecionado";

export class FreteService {
  private readonly apiUrl = process.env.NEXT_PUBLIC_API_URL;

  static getFreteSalvo(): FreteSelecionadoStorage | null {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(FRETE_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as FreteSelecionadoStorage;
    } catch {
      return null;
    }
  }

  static salvarFrete(frete: FreteSelecionadoStorage) {
    sessionStorage.setItem(FRETE_STORAGE_KEY, JSON.stringify(frete));
  }

  static limparFrete() {
    sessionStorage.removeItem(FRETE_STORAGE_KEY);
  }

  async cotar(
    cepDestino: string,
    itens: CotarFreteItemRequest[],
    opcaoSelecionada?: string,
  ): Promise<CotarFreteResponse> {
    if (!this.apiUrl) {
      throw new Error("API não configurada (NEXT_PUBLIC_API_URL).");
    }

    const guidRe =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const itensPayload = itens.map((item) => {
      const id = item.idProduto?.trim();
      const idProduto = id && guidRe.test(id) ? id : undefined;
      return {
        idProduto,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        tipoProduto: item.tipoProduto,
      };
    });

    const res = await fetch(`${this.apiUrl}/frete/cotar`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cepDestino,
        opcaoSelecionada,
        itens: itensPayload,
      }),
    });

    if (!res.ok) {
      let msg = "Não foi possível calcular o frete.";
      try {
        const err = (await res.json()) as { message?: string };
        if (err.message) msg = err.message;
      } catch {
        /* ignore */
      }
      throw new Error(msg);
    }

    return res.json();
  }
}
