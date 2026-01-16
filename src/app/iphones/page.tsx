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
  Skeleton,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import { ProdutoService } from "@/services/auth/produto.service";
import { formatarDinheiro } from "@/utils/mascara_dinheiro";
import { Produto } from "@/types/ProdutoNovo.type";
import { AddShoppingCart } from "@mui/icons-material";
import { CheckIcon } from "lucide-react";
import { CarrinhoService } from "@/services/carrinho/carrinho.service";

export default function ProdutosLista() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const [nomeProduto, setNomeProduto] = useState("");
  const [precoMinimo, setPrecoMinimo] = useState<number | undefined>();
  const [precoMaximo, setPrecoMaximo] = useState<number | undefined>();

  const [loading, setLoading] = useState(true);

  const produtoService = new ProdutoService();
  const tipoProduto = 1;

  const [addedId, setAddedId] = useState<number | null>(null);

  const serviceCarrinho = new CarrinhoService();
  
  const handleClick = (idProduto: number, quantidade: number) => {
    const token = sessionStorage.getItem("auth_token") || "";
    const produto_carrinho = {
      IdProduto: idProduto,
      Quantidade: quantidade,
    };

    serviceCarrinho.postCarrinho(produto_carrinho, token);

    setAddedId(idProduto);

    setTimeout(() => {
      setAddedId(null);
    }, 1200);
  };

  const carregarProdutos = async () => {
    setLoading(true);

    const resp = await produtoService.getProdutosPorTipo(
      tipoProduto,
      pagina,
      8
    );

    console.log(resp);

    setProdutos(resp.itens);
    setTotalPaginas(resp.totalPaginas);

    setTimeout(() => {
      setLoading(false);
    }, 400);
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
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card
                key={i}
                variant="outlined"
                sx={{
                  bgcolor: "#121212",
                  borderColor: "#1f1f1f",
                  borderRadius: "xl",
                  minWidth: "300px",
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
          : produtos.map((p) => {
              const isAdded = addedId === p.id;

              return (
              <Card
                key={p.id}
                variant="outlined"
                sx={{
                  bgcolor: "#121212",
                  borderColor: "#1f1f1f",
                  borderRadius: "xl",
                  transition: "all 0.3s ease",
                  minWidth: "300px",
                  height: "540px",
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
                      mt: 1,
                      bgcolor: "#fff",
                      color: "#000",
                      fontWeight: 700,
                      "&:hover": { bgcolor: "#f5f5f5" },
                      textTransform: "none",
                      mb: 1
                    }}
                    onClick={() => router.push(`/compra?produtoId=${p.id}`)}
                  >
                    Comprar agora
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => handleClick(p.id, 1)}
                    sx={{
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        transform: isAdded ? "translateY(-40px)" : "translateY(0)",
                        opacity: isAdded ? 0 : 1,
                        transition: "all 0.3s ease",
                        position: "absolute",
                      }}
                    >
                      <AddShoppingCart />
                      Adicionar ao carrinho
                    </Box>
    
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        transform: isAdded ? "translateY(0)" : "translateY(40px)",
                        opacity: isAdded ? 1 : 0,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <CheckIcon />
                      Adicionado!
                    </Box>
                  </Button>
                </CardContent>
              </Card>
              );
            })}
      </Box>

      {/* PAGINAÇÃO (esconde enquanto carrega) */}
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
  );
}
