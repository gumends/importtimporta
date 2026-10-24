import { Produto, ProdutosResponse } from "@/types/ProdutoNovo.type";

export class ProdutoService {
  private readonly apiUrl = process.env.NEXT_PUBLIC_API_URL;

  private get apiBase(): string {
    if (!this.apiUrl) {
      throw new Error(
        "API não configurada. Defina NEXT_PUBLIC_API_URL no .env.local (ex.: http://localhost:5083).",
      );
    }
    return this.apiUrl;
  }

  async postProduto(
    produto: FormularioProduto,
    token: string,
  ): Promise<Produto> {
    const res = await fetch(`${this.apiBase}/produto`, {
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

  async buscarProdutosPorNome(termo: string, limite = 8): Promise<ProdutosResponse> {
    const q = termo.trim();
    if (q.length < 2) {
      return {
        itens: [],
        paginaAtual: 1,
        tamanhoPagina: limite,
        totalItens: 0,
        totalPaginas: 0,
      };
    }

    return this.getProdutos({
      pagina: 1,
      nomeProduto: q,
      tamanhoPagina: limite,
    });
  }

  async getProdutos(params: {
    pagina: number;
    nomeProduto?: string;
    precoMinimo?: number;
    precoMaximo?: number;
    tamanhoPagina?: number;
  }) {
    const query = new URLSearchParams();

    query.append("pagina", params.pagina.toString());
    query.append("tamanhoPagina", String(params.tamanhoPagina ?? 10));

    if (params.nomeProduto) query.append("nomeProduto", params.nomeProduto);

    if (params.precoMinimo !== undefined)
      query.append("precoMinimo", params.precoMinimo.toString());

    if (params.precoMaximo !== undefined)
      query.append("precoMaximo", params.precoMaximo.toString());

    const response = await fetch(`${this.apiBase}/produto?${query.toString()}`);

    return response.json();
  }

  async getProdutoPorId(id: string): Promise<Produto> {
    const res = await fetch(`${this.apiBase}/produto/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Produto não encontrado");
    }

    return res.json();
  }

  async criarProduto(produto: Produto, token: string): Promise<Produto> {
    const res = await fetch(`${this.apiBase}/produto`, {
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

  async atualizarProdutoFormData(
    id: string,
    formData: FormData,
  ): Promise<void> {
    const token = sessionStorage.getItem("auth_token");
    const res = await fetch(`${this.apiBase}/produto/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token ?? ""}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg =
        (err as { message?: string }).message ??
        "Erro ao atualizar produto (verifique se você é admin e fez login de novo).";
      throw new Error(msg);
    }
  }

  async getProdutosPromocao(pagina = 1, limite = 2): Promise<ProdutosResponse> {
    const res = await fetch(
      `${this.apiBase}/produto/promocao?pagina=${pagina}&tamanhoPagina=${limite}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar promoções");
    }

    return res.json();
  }

  async getProdutosPorTipo(
    tipoProduto: number,
    pagina = 1,
    limite = 2,
  ): Promise<ProdutosResponse> {
    const res = await fetch(
      `${this.apiBase}/produto/tipo/${tipoProduto}?pagina=${pagina}&tamanhoPagina=${limite}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar produtos por tipo");
    }

    return await res.json();
  }

  async getProdutosVariados(quantidade: number): Promise<Produto[]> {
    const res = await fetch(
      `${this.apiBase}/produto/variados?quantidade=${quantidade}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar produtos variados");
    }

    const data: Produto[] = await res.json();

    return data;
  }

  async deletarProduto(id: string) {
    const res = await fetch(`${this.apiBase}/produto/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as { message?: string }).message ??
          "Erro ao deletar produto (403: faça logout e login de novo como admin).",
      );
    }

    return res;
  }

  async desativarProduto(id: string) {
    const res = await fetch(`${this.apiBase}/produto/desativar/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as { message?: string }).message ?? "Erro ao desativar produto",
      );
    }

    return res;
  }

  async ativarProduto(id: string) {
    const res = await fetch(`${this.apiBase}/produto/ativar/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as { message?: string }).message ?? "Erro ao ativar produto",
      );
    }

    return res;
  }

  async salvarImagens(idProduto: string,imagens: File[]) {
    const formData = new FormData();

    imagens.forEach((file) => {
      formData.append("imagens", file);
    });

    const response = await fetch(
      `${this.apiBase}/produto/SalvarImagens?idProduto=${idProduto}`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Erro ao enviar imagens");
    }

    return await response.json();
  }
}
