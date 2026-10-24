/** Grade de catálogo: no máximo 3 colunas; reduz 3 → 2 → 1 conforme a tela. */
export const produtosGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
    md: "repeat(3, minmax(0, 1fr))",
  },
  gap: 3,
  width: "100%",
} as const;

export const produtosPaginaLayoutSx = {
  color: "#fff",
  minHeight: "100vh",
  py: { xs: 4, md: 6 },
  px: { xs: 2, md: 4 },
  maxWidth: 1280,
  mx: "auto",
} as const;

export const produtosPaginaFlexSx = {
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  alignItems: "flex-start",
  gap: { xs: 3, md: 4 },
} as const;

export const produtosSidebarSx = {
  width: { xs: "100%", md: 280 },
  flexShrink: 0,
} as const;

export const produtosConteudoSx = {
  flex: 1,
  minWidth: 0,
  width: "100%",
} as const;
