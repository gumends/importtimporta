import { jwtDecode } from "jwt-decode";

/** Decodifica JWT sem derrubar a UI se o token estiver ausente ou inválido. */
export function decodeJwtSafe<T>(token: string | null | undefined): T | null {
  if (!token?.trim()) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    return jwtDecode<T>(token);
  } catch {
    return null;
  }
}

export function isJwtFormat(token: string | null | undefined): boolean {
  if (!token?.trim()) return false;
  return token.split(".").length === 3;
}
