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
  Input,
  Stack,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { buscaTipoProduto } from "@/services/produtos/produtos.service";
import { Produto } from "@/types/produto.type";
import { formatarDinheiro } from "@/utils/mascara_dinheiro";

export default function ProdutosLista() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const [nomeProduto, setNomeProduto] = useState("");
  const [precoMinimo, setPrecoMinimo] = useState<number | undefined>();
  const [precoMaximo, setPrecoMaximo] = useState<number | undefined>();

  const tipoProduto = 1;

  const carregarProdutos = async () => {
    const { produtos, totalPaginas } = await buscaTipoProduto(
      tipoProduto,
      pagina,
      8,
      nomeProduto,
      precoMinimo,
      precoMaximo
    );
    setProdutos(produtos);
    setTotalPaginas(totalPaginas);
  };

  useEffect(() => {
    carregarProdutos();
  }, [pagina]);

  const aplicarFiltros = async () => {
    setPagina(1);
    await carregarProdutos();
  };

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
        iPhones disponíveis
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 5,
          justifyContent: "center",
        }}
      >
        <Input
          placeholder="Buscar por nome"
          variant="soft"
          value={nomeProduto}
          onChange={(e) => setNomeProduto(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <Input
          placeholder="Preço mínimo"
          type="number"
          variant="soft"
          value={precoMinimo ?? ""}
          onChange={(e) =>
            setPrecoMinimo(e.target.value ? Number(e.target.value) : undefined)
          }
          sx={{ minWidth: 150 }}
        />
        <Input
          placeholder="Preço máximo"
          type="number"
          variant="soft"
          value={precoMaximo ?? ""}
          onChange={(e) =>
            setPrecoMaximo(e.target.value ? Number(e.target.value) : undefined)
          }
          sx={{ minWidth: 150 }}
        />
        <Button
          onClick={aplicarFiltros}
          variant="solid"
          sx={{
            bgcolor: "#fff",
            color: "#000",
            fontWeight: 700,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          Aplicar filtros
        </Button>
      </Box>
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
        {produtos.map((p) => (
          <Card
            key={p.id}
            variant="outlined"
            sx={{
              bgcolor: "#121212",
              borderColor: "#1f1f1f",
              borderRadius: "xl",
              transition: "all 0.3s ease",
              minWidth: "300px",
              height: "530px", // 🔥 card com altura fixa
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 8px 25px rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            {/* IMAGEM */}
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

            <CardContent
              sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              {/* TÍTULO (fixo, 1 linha) */}
              <Typography
                level="title-md"
                sx={{
                  color: "#fff",
                  fontWeight: 500,
                  mb: 1,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  height: "24px",
                }}
              >
                {p.nomeProduto}
              </Typography>

              {/* DESCRIÇÃO (fixa, 2 linhas) */}
              <Typography
                level="body-sm"
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  mb: 1,
                  height: "32px", // 🔥 trava 2 linhas
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {p.descricao}
              </Typography>

              {/* BLOCO PREÇO (fixo) */}
              <Box
                sx={{
                  height: "40px", // 🔥 sempre reserva espaço igual
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {p.valorOriginal > p.valor && (
                  <Typography
                    level="body-sm"
                    sx={{
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "line-through",
                      fontSize: "0.85rem",
                    }}
                  >
                    {formatarDinheiro(p.valorOriginal)}
                  </Typography>
                )}

                <Typography
                  level="title-lg"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    mt: p.valorOriginal > p.valor ? 0.3 : 1,
                  }}
                >
                  {formatarDinheiro(p.valor)}
                </Typography>
              </Box>

              {/* BOTÃO FIXO NO FINAL */}
              <Button
                fullWidth
                variant="solid"
                sx={{
                  mt: "auto", // 🔥 mantém o botão no rodapé sem empurrar nada
                  bgcolor: "#fff",
                  color: "#000",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#f5f5f5" },
                  textTransform: "none",
                }}
                onClick={() =>
                  router.push(`/compra?produtoId=${p.id}&modeloId=${p.id}`)
                }
              >
                Comprar agora
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
      {totalPaginas > 1 && (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ mt: 6 }}
        >
          <Button
            variant="outlined"
            color="neutral"
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={pagina === 1}
          >
            Anterior
          </Button>

          <Typography level="body-md" sx={{ color: "#fff" }}>
            Página {pagina} de {totalPaginas}
          </Typography>

          <Button
            variant="outlined"
            color="neutral"
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas}
          >
            Próxima
          </Button>
        </Stack>
      )}
    </Box>
  );
}
