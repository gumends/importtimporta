export interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export class CepService {
  async getCep(cep: string): Promise<ViaCepResponse> {
    const res = await fetch(
      `https://viacep.com.br/ws/${cep}/json/`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar CEP");
    }

    return res.json();
  }
}