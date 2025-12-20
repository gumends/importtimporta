import { Produto, ProdutosResponse } from "@/types/ProdutoNovo.type";

export class ProdutoService {
  private readonly apiUrl = "https://localhost:7126";

  async getProdutos(pagina: number): Promise<ProdutosResponse> {
    const res = await fetch(
      `${this.apiUrl}/produto?pagina=${pagina}&tamanhoPagina=10`,
      { 
        cache: "no-store", 
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("auth_token"),
        }
      }
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar produtos");
    }

    return res.json();
  }

  async getProdutoPorId(id: number): Promise<Produto> {
    const res = await fetch(`${this.apiUrl}/produto/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Produto não encontrado");
    }

    return res.json();
  }

  async criarProduto(produto: Produto, token: string): Promise<Produto> {
    const res = await fetch(`${this.apiUrl}/produto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(produto),
    });

    if (!res.ok) {
      throw new Error("Erro ao criar produto");
    }

    return res.json();
  }

  async atualizarProduto(produto: Produto, token: string): Promise<Produto> {
    const res = await fetch(`${this.apiUrl}/produto`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(produto),
    });

    if (!res.ok) {
      throw new Error("Erro ao atualizar produto");
    }

    return res.json();
  }

  async getProdutosPromocao(
    pagina = 1,
    limite = 2
  ): Promise<ProdutosResponse> {
    const res = await fetch(
      `${this.apiUrl}/produto/promocao?pagina=${pagina}&tamanhoPagina=${limite}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar promoções");
    }

    return res.json();
  }

  async getProdutosPorTipo(
    tipoProduto: number,
    pagina = 1,
    limite = 2
  ): Promise<ProdutosResponse> {
    const res = await fetch(
      `${this.apiUrl}/produto/tipo/${tipoProduto}?pagina=${pagina}&tamanhoPagina=${limite}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar produtos por tipo");
    }

    return res.json();
  }

  async getProdutosVariados(quantidade: number): Promise<Produto[]> {
    const res = await fetch(
      `${this.apiUrl}/produto/variados?quantidade=${quantidade}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar produtos variados");
    }

    const data: ProdutosResponse = await res.json();
    return data.itens;
  }
}
