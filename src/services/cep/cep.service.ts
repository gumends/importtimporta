export class CepService {
  async getCep(cep: string): Promise<Record<string, unknown>> {
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