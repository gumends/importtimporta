"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardOverflow,
  AspectRatio,
  Button,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import { Produto } from "@/types/produto.type";
import { buscaTipoProduto } from "@/services/produtos/produtos.service";
import { formatarDinheiro } from "@/utils/mascara_dinheiro";

export default function ProdutosLista() {
  const router = useRouter();
  const [produtos, setprodutos] = useState<Produto[] | undefined>();

  useEffect(() => {
    buscaTipoProduto(1).then((produtos: Produto[] | undefined) => {
      if (produtos === undefined) {
        return null;
      }
      setprodutos(produtos);
    });
  }, []);

  return (
    <Box
      sx={{
        color: "#fff",
        minHeight: "100vh",
        py: 6,
        px: { xs: 2, md: 6 },
      }}
    >
      <Typography
        level="h2"
        sx={{
          fontWeight: 600,
          textAlign: "center",
          mb: 4,
          color: "#fff",
        }}
      >
        Produtos em destaque
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 4,
        }}
      >
        {produtos ? (
          produtos.map((p) => (
            <Card
              key={p.id}
              variant="outlined"
              sx={{
                bgcolor: "#121212",
                borderColor: "#1f1f1f",
                borderRadius: "xl",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 8px 25px rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <CardOverflow>
                <AspectRatio ratio="1" sx={{ bgcolor: "#000" }}>
                  <img
                    src={p.imagem}
                    alt={p.nomeProduto}
                    loading="lazy"
                    style={{
                      objectFit: "contain",
                      backgroundColor: "#000",
                      padding: "10px",
                    }}
                  />
                </AspectRatio>
              </CardOverflow>

              <CardContent>
                <Typography
                  level="title-md"
                  sx={{
                    color: "#fff",
                    fontWeight: 500,
                    mb: 1,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.nomeProduto}
                </Typography>

                <Typography
                  level="body-sm"
                  sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}
                >
                  {p.descricao}
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  {p.valorOriginal > p.valor && (
                    <Typography
                      level="body-sm"
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        textDecoration: "line-through",
                      }}
                    >
                      {formatarDinheiro(p.valorOriginal)}
                    </Typography>
                  )}

                  {p.desconto > 0 && (
                    <Typography level="body-xs">
                      - {formatarDinheiro(p.desconto)}
                    </Typography>
                  )}
                </Box>

                <Typography
                  level="title-lg"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  {formatarDinheiro(p.valor)}
                </Typography>

                <Button
                  fullWidth
                  variant="solid"
                  sx={{
                    mt: 1,
                    bgcolor: "#fff",
                    color: "#000",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#f5f5f5" },
                    textTransform: "none",
                  }}
                  onClick={() => {
                    router.push(`/compra?produtoId=${p.id}&modeloId=${p.id}`);
                  }}
                >
                  Comprar agora
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}
