import { MenuResponse } from "@/types/menus.type";

export class UserService {
  public apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

  async validaUsuario(email: string) {
    const response = await fetch(`${this.apiUrl}/usuario/valid?email=${email}`);
    const data: boolean = await response.json();
    return data;
  }

  async BuscaUsuario(email: string) {
    const response = await fetch(`${this.apiUrl}/usuario?email=${email}`,{
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("auth_token"),
      },
    });

    const data = await response.json();
    return data;
  }

  async createUser(
    name: string,
    email: string,
    senha: string,
    nascimento: string,
    state: string
  ) {
    const response = await fetch(
      `${this.apiUrl}/usuario?state=${encodeURIComponent(state)}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("auth_token"),
        },
        body: JSON.stringify({ name, email, senha, nascimento }),
      }
    );
    if (!response.ok) throw new Error("Falha ao fazer cadastro");
    return await response.json();
  }

  async updateUser(
    id: string,
    name: string,
    email: string,
    senha: string,
    nascimento: string
  ) {
    const response = await fetch(`${this.apiUrl}/usuario?id=${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("auth_token"),
      },
      body: JSON.stringify({ id, name, email, senha, nascimento }),
    });
    if (!response.ok) throw new Error("Falha ao atualizar usuário");
    return await response.json();
  }

  async getAllUser(pagina: number, tamanhoPagina: number = 8) {
    const response = await fetch(
      `${this.apiUrl}/usuario/paginado?pagina=${pagina}&tamanhoPagina=${tamanhoPagina}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("auth_token"),
        },
      }
    );
    if (!response.ok) throw new Error("Falha ao atualizar usuário");
    return await response.json();
  }

  async toggleUserStatus(id: number) {
    const response = await fetch(
      `${this.apiUrl}/usuario/toggle_status?id=${id}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("auth_token"),
        },
      }
    );
    if (!response.ok) throw new Error("Falha ao alterar status do usuário");
    return response;
  }

  async toggleUserAccess(id: number) {
    const response = await fetch(
      `${this.apiUrl}/usuario/toggle_acesso?id=${id}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("auth_token"),
        },
      }
    );
    if (!response.ok) throw new Error("Falha ao alterar acesso do usuário");
    return response;
  }

  async GetMenus(email: string): Promise<MenuResponse> {
    const response = await fetch(
      `${this.apiUrl}/usuario/menus?email=${email}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("auth_token"),
        },
      }
    );
    if (!response.ok) throw new Error("Falha ao buscar menus do usuário");
    return response.json();
  }
}
