const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** IDs reais na API (linha iPhone 18 da vitrine). */
export const CATALOGO_IPHONE18 = {
  proMax: "18f5df0e-ecb6-4dcb-b411-5920bf40c7d0",
  pro: "eb671e38-d4a4-4233-8c58-11b8b77c87f3",
  /** Produto dobrável na vitrine (cadastro legado “Air” na API). */
  flip: "8f23ba23-6666-4064-9bfc-19f194b94339",
  /** iPhone 18 base — fora da vitrine; mantido para URLs antigas. */
  base: "6666505b-5c3c-4c5e-912d-3e4c22536646",
} as const;

const VITRINE_PARA_CATALOGO: Record<number, string> = {
  7: CATALOGO_IPHONE18.proMax,
  8: CATALOGO_IPHONE18.pro,
  10: CATALOGO_IPHONE18.flip,
};

export function isUuidProduto(value: string): boolean {
  return UUID_REGEX.test(value.trim());
}

/**
 * Converte produtoId da URL para GUID da loja.
 * Aceita UUID ou IDs numéricos legados da vitrine (7–21).
 */
export function resolverProdutoIdCatalogo(raw: string | null): string | null {
  if (!raw?.trim()) return null;

  const id = raw.trim();
  if (isUuidProduto(id)) return id;

  const n = Number(id);
  if (!Number.isFinite(n)) return null;

  if (VITRINE_PARA_CATALOGO[n]) return VITRINE_PARA_CATALOGO[n];

  if (n === 9 || (n >= 13 && n <= 17)) return CATALOGO_IPHONE18.base;
  if (n >= 7 && n <= 8) return CATALOGO_IPHONE18.proMax;
  if (n >= 10 && n <= 12) return CATALOGO_IPHONE18.pro;
  if (n >= 18 && n <= 21) return CATALOGO_IPHONE18.flip;

  return null;
}
