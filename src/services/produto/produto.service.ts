import { Produto, ProdutosResponse } from "@/types/ProdutoNovo.type";

export class ProdutoService {
  private readonly apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async postProduto(
    produto: FormularioProduto,
    token: string,
  ): Promise<Produto> {
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

  async getProdutos(params: {
    pagina: number;
    nomeProduto?: string;
    precoMinimo?: number;
    precoMaximo?: number;
  }) {
    const query = new URLSearchParams();

    query.append("pagina", params.pagina.toString());
    query.append("tamanhoPagina", "10");

    if (params.nomeProduto) query.append("nomeProduto", params.nomeProduto);

    if (params.precoMinimo !== undefined)
      query.append("precoMinimo", params.precoMinimo.toString());

    if (params.precoMaximo !== undefined)
      query.append("precoMaximo", params.precoMaximo.toString());

    const response = await fetch(`${this.apiUrl}/produto?${query.toString()}`);

    return response.json();
  }

  async getProdutoPorId(id: string): Promise<FormularioProduto> {
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

  async getProdutosPromocao(pagina = 1, limite = 2): Promise<ProdutosResponse> {
    const res = await fetch(
      `${this.apiUrl}/produto/promocao?pagina=${pagina}&tamanhoPagina=${limite}`,
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
      `${this.apiUrl}/produto/tipo/${tipoProduto}?pagina=${pagina}&tamanhoPagina=${limite}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar produtos por tipo");
    }

    return await res.json();
  }

  async getProdutosVariados(quantidade: number): Promise<Produto[]> {
    const res = await fetch(
      `${this.apiUrl}/produto/variados?quantidade=${quantidade}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar produtos variados");
    }

    const data: Produto[] = await res.json();

    return data;
  }

  async deletarProduto(id: string) {
    const res = await fetch(`${this.apiUrl}/produto/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
      },
    });

    if (!res.ok) {
      throw new Error("Erro ao deletar produto");
    }

    return res;
  }

  async desativarProduto(id: string) {
    const res = await fetch(`${this.apiUrl}/produto/ativa_desativa/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
      },
    });

    if (!res.ok) {
      throw new Error("Erro ao deletar produto");
    }

    return res;
  }

  async salvarImagens(idProduto: string,imagens: File[]) {
    const formData = new FormData();

    imagens.forEach((file) => {
      formData.append("imagens", file);
    });

    const response = await fetch(
      `${this.apiUrl}/produto/SalvarImagens?idProduto=${idProduto}`,
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
