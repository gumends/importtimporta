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
  Stack,
  Input,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import { buscaTipoProduto } from "@/services/produtos/produtos.service";
import { formatarDinheiro } from "@/utils/mascara_dinheiro";
import { Produto } from "@/types/produto.type";

export default function ProdutosLista() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Filtros
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoMinimo, setPrecoMinimo] = useState<number | undefined>();
  const [precoMaximo, setPrecoMaximo] = useState<number | undefined>();

  const tipoProduto = 5; // Produtos diversos

  const carregarProdutos = async (
    paginaAtual = pagina,
    nome?: string,
    min?: number,
    max?: number
  ) => {
    const resultado = await buscaTipoProduto(
      tipoProduto,
      paginaAtual,
      8,
      nome,
      min,
      max
    );
    if (resultado.produtos.length > 0) {
      setProdutos(resultado.produtos);
      setTotalPaginas(resultado.totalPaginas);
    } else {
      setProdutos([]);
      setTotalPaginas(1);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, [pagina]);

  const aplicarFiltros = async () => {
    setPagina(1);
    await carregarProdutos(1, nomeProduto, precoMinimo, precoMaximo);
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
        Produtos diversos disponíveis
      </Typography>

      {/* 🔍 Formulário de Filtro */}
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

      {/* 🧱 Lista de produtos */}
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
        {produtos && produtos.length > 0 ? (
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
                  onClick={() =>
                    router.push(`/compra?produtoId=${p.id}&modeloId=${p.id}`)
                  }
                >
                  Comprar agora
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography
            level="body-md"
            sx={{ color: "rgba(255,255,255,0.7)", textAlign: "center", mt: 4 }}
          >
            Nenhum produto encontrado com os filtros aplicados.
          </Typography>
        )}
      </Box>

      {/* 📄 Paginação */}
      {totalPaginas > 0 && (
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
