import { Usuario } from "@/types/usuario.type";

interface LoginResponse {
  token: string;
}

export class GoogleAuthService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async getGoogleLoginUrl(state: string): Promise<string> {
    if (!this.apiUrl) {
      throw new Error(
        "API não configurada. Defina NEXT_PUBLIC_API_URL no .env.local.",
      );
    }

    const res = await fetch(
      `${this.apiUrl}/auth/google-url?state=${encodeURIComponent(state)}`,
    );

    const data = (await res.json().catch(() => ({}))) as {
      auth?: string;
      message?: string;
    };

    if (!res.ok) {
      throw new Error(
        data.message ||
          "Não foi possível gerar URL de login Google. Verifique a configuração OAuth na API.",
      );
    }

    if (!data.auth?.includes("client_id=") || /client_id=&/.test(data.auth)) {
      throw new Error(
        "Google OAuth sem Client ID na API. Configure Authentication:Google no backend.",
      );
    }

    return data.auth;
  }

  async me(): Promise<Usuario | null> {
    const sessionToken = sessionStorage.getItem("auth_token");
    if (!sessionToken) return null;

    try {
      const res = await fetch(`${this.apiUrl}/auth/me`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ sessionToken }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) return null;

      const user = (await res.json()) as Usuario;
      return user?.email ? user : null;
    } catch {
      return null;
    }
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
    if (!this.apiUrl) {
      throw new Error(
        "API não configurada. Defina NEXT_PUBLIC_API_URL no .env.local (ex.: http://localhost:5083).",
      );
    }

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
