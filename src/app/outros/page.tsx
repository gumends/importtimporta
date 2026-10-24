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
  Skeleton,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import { ProdutoService } from "@/services/produto/produto.service";
import { formatarDinheiro } from "@/utils/mascara_dinheiro";
import { Produto } from "@/types/ProdutoNovo.type";
import FiltroProdutosCategoria from "@/app/components/produtos/FiltroProdutosCategoria";
import {
  produtosConteudoSx,
  produtosGridSx,
  produtosPaginaFlexSx,
  produtosPaginaLayoutSx,
  produtosSidebarSx,
} from "@/app/components/produtos/produtosGridSx";

export default function ProdutosLista() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const [nomeProduto, setNomeProduto] = useState("");
  const [precoMinimo, setPrecoMinimo] = useState<number | undefined>();
  const [precoMaximo, setPrecoMaximo] = useState<number | undefined>();

  const [loading, setLoading] = useState(true);
  const [erroCarregar, setErroCarregar] = useState(false);

  const produtoService = new ProdutoService();
  const tipoProduto = 4;

  const carregarProdutos = async (paginaAlvo = pagina) => {
    setLoading(true);
    setErroCarregar(false);
    try {
      const resp = await produtoService.getProdutosPorTipo(
        tipoProduto,
        paginaAlvo,
        8,
      );
      setProdutos(resp?.itens ?? []);
      setTotalPaginas(resp?.totalPaginas ?? 0);
    } catch {
      setProdutos([]);
      setTotalPaginas(0);
      setErroCarregar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, [pagina]);

  const aplicarFiltros = async () => {
    setPagina(1);
    await carregarProdutos();
  };

  const limparFiltros = async () => {
    setNomeProduto("");
    setPrecoMinimo(undefined);
    setPrecoMaximo(undefined);
    setPagina(1);
    await carregarProdutos(1);
  };

  return (
    <Box sx={produtosPaginaLayoutSx}>
      <Box sx={produtosPaginaFlexSx}>
        <Box sx={produtosSidebarSx}>
          <FiltroProdutosCategoria
            nomeProduto={nomeProduto}
            precoMinimo={precoMinimo}
            precoMaximo={precoMaximo}
            onNomeChange={setNomeProduto}
            onPrecoMinChange={setPrecoMinimo}
            onPrecoMaxChange={setPrecoMaximo}
            onAplicar={aplicarFiltros}
            onLimpar={limparFiltros}
            loading={loading}
          />
        </Box>

        <Box sx={produtosConteudoSx}>
          <Typography level="h2" sx={{ fontWeight: 600, mb: 4, color: "#fff" }}>
            Outros produtos disponíveis
          </Typography>

          <Box sx={produtosGridSx}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card
                key={i}
                variant="outlined"
                sx={{
                  bgcolor: "#121212",
                  borderColor: "#1f1f1f",
                  borderRadius: "xl",
                  height: "530px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardOverflow>
                  <AspectRatio ratio="1" sx={{ bgcolor: "#000" }}>
                    <Skeleton />
                  </AspectRatio>
                </CardOverflow>
                <Box sx={{}}>
                  <Skeleton
                    sx={{ width: "80%", height: 24, borderRadius: 8 }}
                  />
                </Box>
                <Box>
                  <Skeleton
                    sx={{ width: "90%", height: 24, borderRadius: 8, mt: 2 }}
                  />
                </Box>
                <Box>
                  <Skeleton
                    sx={{ width: "40%", height: 24, borderRadius: 8, mt: 6 }}
                  />
                </Box>
                <Box>
                  <Skeleton
                    sx={{ width: "60%", height: 24, borderRadius: 8, mt: 8 }}
                  />
                </Box>
                <Box>
                  <Skeleton
                    sx={{ width: "90%", height: 35, borderRadius: 8, mt: 15 }}
                  />
                </Box>
              </Card>
            ))
          : produtos.map((p) => (
              <Card
                key={p.id}
                variant="outlined"
                sx={{
                  bgcolor: "#121212",
                  borderColor: "#1f1f1f",
                  borderRadius: "xl",
                  transition: "all 0.3s ease",
                  height: "530px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 8px 25px rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <CardOverflow>
                  <AspectRatio ratio="1" sx={{ bgcolor: "#000" }}>
                    <img
                      src={
                        Array.isArray(p.imagens)
                          ? p.imagens[0].caminho
                          : p.imagens || undefined
                      }
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

                  <Typography
                    level="body-sm"
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      mb: 1,
                      height: "32px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {p.descricao}
                  </Typography>

                  <Box
                    sx={{
                      height: "40px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    {p.valorOriginal > (p.valor ?? 0) && (
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
                        mt: p.valorOriginal > (p.valor ?? 0) ? 0.3 : 1,
                      }}
                    >
                      {formatarDinheiro(p.valor ?? 0)}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="solid"
                    sx={{
                      mt: "auto",
                      bgcolor: "#fff",
                      color: "#000",
                      fontWeight: 700,
                      "&:hover": { bgcolor: "#f5f5f5" },
                      textTransform: "none",
                    }}
                    onClick={() => router.push(`/compra?produtoId=${p.id}`)}
                  >
                    Comprar agora
                  </Button>
                </CardContent>
              </Card>
            ))}

        {!loading && produtos.length === 0 && (
          <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 8, px: 2 }}>
            <Typography level="h4" sx={{ mb: 1 }}>
              {erroCarregar
                ? "Não foi possível carregar os produtos"
                : "Nenhum produto nesta categoria ainda"}
            </Typography>
            <Typography sx={{ opacity: 0.65, mb: 2 }}>
              {erroCarregar
                ? "Verifique se a API está rodando em localhost:5083."
                : "Em breve novidades nesta categoria."}
            </Typography>
            <Button variant="soft" onClick={() => void carregarProdutos(pagina)}>
              Tentar novamente
            </Button>
          </Box>
        )}
          </Box>

          {!loading && totalPaginas > 1 && (
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
      </Box>
    </Box>
  );
}
