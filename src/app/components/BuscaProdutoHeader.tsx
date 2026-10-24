"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Input,
  Sheet,
  Typography,
} from "@mui/joy";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProdutoService } from "@/services/produto/produto.service";
import { Produto } from "@/types/ProdutoNovo.type";
import { formatarDinheiro } from "@/utils/mascara_dinheiro";

type Props = {
  /** Largura fixa no desktop; no mobile usa 100% */
  largura?: number | string;
  size?: "sm" | "md";
  fullWidth?: boolean;
};

function imagemProduto(p: Produto): string {
  const img = p.imagens?.[0]?.caminho;
  return img && typeof img === "string" ? img : "/placeholder.png";
}

export default function BuscaProdutoHeader({
  largura = 450,
  size = "sm",
  fullWidth = false,
}: Props) {
  const router = useRouter();
  const service = new ProdutoService();
  const rootRef = useRef<HTMLDivElement>(null);

  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState<Produto[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [painelAberto, setPainelAberto] = useState(false);
  const [buscou, setBuscou] = useState(false);

  const executarBusca = useCallback(async (texto: string) => {
    const q = texto.trim();
    if (q.length < 2) {
      setResultados([]);
      setTotal(0);
      setBuscou(false);
      setPainelAberto(false);
      return;
    }

    setLoading(true);
    setPainelAberto(true);
    setBuscou(true);
    try {
      const res = await service.buscarProdutosPorNome(q, 8);
      setResultados(res.itens ?? []);
      setTotal(res.totalItens ?? 0);
    } catch {
      setResultados([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (termo.trim().length >= 2) {
        void executarBusca(termo);
      } else {
        setResultados([]);
        setPainelAberto(false);
        setBuscou(false);
      }
    }, 350);

    return () => window.clearTimeout(t);
  }, [termo, executarBusca]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setPainelAberto(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const irParaProduto = (id: string) => {
    setPainelAberto(false);
    setTermo("");
    router.push(`/compra?produtoId=${id}`);
  };

  const inputSx = {
    flexGrow: fullWidth ? 1 : undefined,
    width: fullWidth ? "100%" : largura,
    bgcolor: "rgba(255,255,255,0.06)",
    color: "#fff",
    borderRadius: "md",
    border: "1px solid rgba(255,255,255,0.08)",
    "& input::placeholder": { color: "rgba(255,255,255,0.5)" },
  };

  return (
    <Box
      ref={rootRef}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: fullWidth ? "100%" : "auto",
        flex: fullWidth ? 1 : undefined,
      }}
    >
      <Input
        placeholder="Buscar produto..."
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        onFocus={() => {
          if (termo.trim().length >= 2 && buscou) setPainelAberto(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") void executarBusca(termo);
          if (e.key === "Escape") setPainelAberto(false);
        }}
        size={size}
        variant="soft"
        sx={inputSx}
      />
      <IconButton
        size={size}
        variant="soft"
        aria-label="Buscar"
        onClick={() => void executarBusca(termo)}
        sx={{
          bgcolor: "rgba(255,255,255,0.08)",
          "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
        }}
      >
        <Search size={size === "md" ? 20 : 18} color="#fff" />
      </IconButton>

      {painelAberto && (
        <Sheet
          variant="outlined"
          sx={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: fullWidth ? 0 : undefined,
            width: fullWidth ? "100%" : { xs: "min(100vw - 32px, 420px)", md: 480 },
            maxHeight: 380,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            zIndex: 1200,
            bgcolor: "#141414",
            borderColor: "rgba(255,255,255,0.12)",
            borderRadius: "lg",
            boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.25,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography level="body-xs" sx={{ color: "neutral.400" }}>
              {loading
                ? "Buscando..."
                : buscou
                  ? total > 0
                    ? `${total} resultado${total !== 1 ? "s" : ""}`
                    : "Nenhum resultado"
                  : "Digite ao menos 2 caracteres"}
            </Typography>
          </Box>

          <Box sx={{ overflowY: "auto", flex: 1, p: 1 }}>
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size="sm" />
              </Box>
            )}

            {!loading && buscou && resultados.length === 0 && (
              <Typography
                level="body-sm"
                sx={{ color: "neutral.500", textAlign: "center", py: 3, px: 2 }}
              >
                Não encontramos produtos para &quot;{termo.trim()}&quot;.
              </Typography>
            )}

            {!loading &&
              resultados.map((p) => {
                const valor = p.valor ?? p.valorOriginal;
                return (
                  <Box
                    key={p.id}
                    component="button"
                    type="button"
                    onClick={() => irParaProduto(p.id)}
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.25,
                      border: "none",
                      borderRadius: "md",
                      bgcolor: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      color: "inherit",
                      transition: "background 0.15s",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                    }}
                  >
                    <Box
                      component="img"
                      src={imagemProduto(p)}
                      alt=""
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "md",
                        objectFit: "contain",
                        bgcolor: "rgba(255,255,255,0.04)",
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        level="title-sm"
                        sx={{
                          color: "#fff",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.nomeProduto}
                      </Typography>
                      <Typography level="body-xs" sx={{ color: "neutral.500" }}>
                        {p.disponivel ? "Disponível" : "Indisponível"}
                        {p.colorName ? ` · ${p.colorName}` : ""}
                      </Typography>
                    </Box>
                    <Typography
                      level="body-sm"
                      fontWeight="lg"
                      sx={{ color: "#fff", flexShrink: 0 }}
                    >
                      {formatarDinheiro(Number(valor))}
                    </Typography>
                  </Box>
                );
              })}
          </Box>

          {!loading && total > resultados.length && resultados.length > 0 && (
            <Box
              sx={{
                px: 2,
                py: 1,
                borderTop: "1px solid rgba(255,255,255,0.08)",
                textAlign: "center",
              }}
            >
              <Typography level="body-xs" sx={{ color: "neutral.500" }}>
                Mostrando {resultados.length} de {total}. Refine a busca para
                achar mais rápido.
              </Typography>
            </Box>
          )}
        </Sheet>
      )}
    </Box>
  );
}
