import { Usuario } from "@/types/usuario.type";

interface LoginResponse {
  token: string;
}

export class GoogleAuthService {
  private apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

  async getGoogleLoginUrl(state: string): Promise<string> {
    const res = await fetch(
      `${this.apiUrl}/auth/google-url?state=${encodeURIComponent(state)}`
    );
    if (!res.ok) throw new Error("Não foi possível gerar URL de login Google");
    const data = await res.json();
    return data.auth;
  }

  async me(): Promise<Usuario> {
    const sessionToken = sessionStorage.getItem("auth_token");
    const res = await fetch(`${this.apiUrl}/auth/me`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ sessionToken }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  }

  async logout(): Promise<void> {
    const res = await fetch(`${this.apiUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Falha ao fazer logout");
    sessionStorage.removeItem("auth_token");
    return await res.json();
  }

  async login(email: string, senha: string) {
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ email, senha }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao fazer login");
    }

    sessionStorage.setItem("auth_token", data.token);
    return data;
  }
}
