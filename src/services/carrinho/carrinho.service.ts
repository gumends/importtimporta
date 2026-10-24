import { CarrinhoRequest } from "@/types/carrinhoRequest";
import { CarrinhoResponse, NewCarrinhoDto } from "@/types/carrinhoRespone";
import { ProdutoService } from "@/services/produto/produto.service";
import { Produto } from "@/types/ProdutoNovo.type";

export const CARRINHO_ATUALIZADO_EVENT = "carrinho-atualizado";
const CARRINHO_STORAGE_KEY = "carrinho";

function emitirAtualizacaoCarrinho() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CARRINHO_ATUALIZADO_EVENT));
  }
}

function carrinhoVazio(): CarrinhoResponse {
  return { subtotal: 0, total: 0, taxaEntrega: 0, itens: [] };
}

function recalcularTotais(itens: NewCarrinhoDto[]): CarrinhoResponse {
  const subtotal = itens.reduce((acc, item) => acc + item.totalItem, 0);
  return {
    itens,
    subtotal,
    taxaEntrega: 0,
    total: subtotal,
  };
}

function produtoParaItemLocal(produto: Produto, quantidade: number): NewCarrinhoDto {
  const valorUnitario = Number(produto.valor ?? produto.valorOriginal ?? 0);
  return {
    id: `local-${produto.id}`,
    idProduto: produto.id,
    nomeProduto: produto.nomeProduto,
    valorUnitario,
    quantidade,
    totalItem: valorUnitario * quantidade,
    imagemUrl: produto.imagens?.[0]?.caminho ?? "",
    descricao: produto.descricao,
  };
}

function normalizarCarrinhoSalvo(raw: unknown): CarrinhoResponse {
  if (!raw || typeof raw !== "object") return carrinhoVazio();

  const data = raw as Record<string, unknown>;

  if (Array.isArray(data.itens)) {
    const itens = (data.itens as NewCarrinhoDto[]).map((item) => ({
      ...item,
      totalItem: item.valorUnitario * item.quantidade,
    }));
    return recalcularTotais(itens);
  }

  // Formato legado (carrinhos + produto aninhado)
  if (Array.isArray(data.carrinhos)) {
    const itens = (data.carrinhos as Array<Record<string, unknown>>).map(
      (item) => {
        const produto = item.produto as Produto | undefined;
        const idProduto = String(item.IdProduto ?? item.idProduto ?? produto?.id ?? "");
        const quantidade = Number(item.quantidade ?? item.Quantidade ?? 1);
        const valorUnitario = Number(
          produto?.valor ?? produto?.valorOriginal ?? 0,
        );
        return {
          id: String(item.id ?? `local-${idProduto}`),
          idProduto,
          nomeProduto: produto?.nomeProduto ?? "Produto",
          valorUnitario,
          quantidade,
          totalItem: valorUnitario * quantidade,
          imagemUrl: produto?.imagens?.[0]?.caminho ?? "",
          descricao: produto?.descricao ?? "",
        };
      },
    );
    return recalcularTotais(itens);
  }

  return carrinhoVazio();
}

export class CarrinhoService {
  private readonly apiUrl = process.env.NEXT_PUBLIC_API_URL;
  private readonly produtoService = new ProdutoService();

  static getCarrinhoLocal(): CarrinhoResponse {
    if (typeof window === "undefined") return carrinhoVazio();
    const raw = sessionStorage.getItem(CARRINHO_STORAGE_KEY);
    if (!raw) return carrinhoVazio();
    try {
      return normalizarCarrinhoSalvo(JSON.parse(raw));
    } catch {
      return carrinhoVazio();
    }
  }

  static salvarCarrinhoLocal(carrinho: CarrinhoResponse) {
    sessionStorage.setItem(CARRINHO_STORAGE_KEY, JSON.stringify(carrinho));
    emitirAtualizacaoCarrinho();
  }

  static getQuantidadeItensLocal(): number {
    return CarrinhoService.getCarrinhoLocal().itens.length;
  }

  async getCarrinho(): Promise<CarrinhoResponse> {
    const token = sessionStorage.getItem("auth_token");
    if (!token) return CarrinhoService.getCarrinhoLocal();

    const res = await fetch(`${this.apiUrl}/carrinho`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar carrinho");
    }

    return res.json();
  }

  async postCarrinho(carrinho: CarrinhoRequest, token: string) {
    const res = await fetch(`${this.apiUrl}/carrinho`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(carrinho),
    });

    if (!res.ok) {
      throw new Error("Erro ao adicionar ao carrinho");
    }

    return res.json();
  }

  async deleteItemCarrinho(id: string) {
    const token = sessionStorage.getItem("auth_token");
    if (!token) {
      const carrinho = CarrinhoService.getCarrinhoLocal();
      carrinho.itens = carrinho.itens.filter((item) => item.id !== id);
      const atualizado = recalcularTotais(carrinho.itens);
      CarrinhoService.salvarCarrinhoLocal(atualizado);
      return;
    }

    const res = await fetch(`${this.apiUrl}/carrinho/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Erro ao remover item do carrinho");
    }

    emitirAtualizacaoCarrinho();
  }

  async adicionarAoCarrinho(idProduto: string, quantidade = 1) {
    if (!idProduto) throw new Error("Produto inválido");

    const token = sessionStorage.getItem("auth_token");

    if (token) {
      await this.postCarrinho({ idProduto, quantidade }, token);
      emitirAtualizacaoCarrinho();
      return;
    }

    const produto = await this.produtoService.getProdutoPorId(idProduto);
    const carrinho = CarrinhoService.getCarrinhoLocal();
    const existente = carrinho.itens.find((i) => i.idProduto === idProduto);

    if (existente) {
      existente.quantidade += quantidade;
      existente.totalItem = existente.valorUnitario * existente.quantidade;
    } else {
      carrinho.itens.push(produtoParaItemLocal(produto as Produto, quantidade));
    }

    CarrinhoService.salvarCarrinhoLocal(recalcularTotais(carrinho.itens));
  }

  async sincronizarCarrinhoLocalComApi(token: string) {
    const local = CarrinhoService.getCarrinhoLocal();
    if (!local.itens.length) return;

    for (const item of local.itens) {
      await this.postCarrinho(
        { idProduto: item.idProduto, quantidade: item.quantidade },
        token,
      );
    }

    sessionStorage.removeItem(CARRINHO_STORAGE_KEY);
    emitirAtualizacaoCarrinho();
  }

  async contarItens(): Promise<number> {
    const token = sessionStorage.getItem("auth_token");
    if (!token) return CarrinhoService.getQuantidadeItensLocal();
    const carrinho = await this.getCarrinho();
    return carrinho.itens.length;
  }
}
