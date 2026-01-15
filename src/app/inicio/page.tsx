"use client";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Card,
  Tooltip,
} from "@mui/joy";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { useEffect, useState } from "react";

import ModalInicial from "../components/ModalInicial";
import {
  getCoresProduto,
  getProduto,
  getProdutosNovaGeracao,
  getProdutosPorProdutoIdEModeloId,
} from "@/services/produtos/produtos.service";

import { ModelosOption, ProdutoAtual } from "@/types/produtoAtual.type";
import { formatarDinheiro } from "@/utils/mascara_dinheiro";
import { ProdutoService } from "@/services/auth/produto.service";
import {
  ProdutosResponse,
  Produto as ProdutoNovo,
} from "@/types/ProdutoNovo.type";
import { AddShoppingCart } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import { CarrinhoService } from "@/services/carrinho/carrinho.service";

export default function Inicio() {
  useEffect(() => {
    getNovaGeracao();
    buscaProdutoAleatoros();
    carregarPromocoes();
  }, []);

  const serviceCarrinho = new CarrinhoService();
  const [added, setAdded] = useState(false);

  const handleClick = (idProduto: number, quantidade: number) => {
    const token = sessionStorage.getItem("auth_token") || "";
    const produto_carrinho = {
      IdProduto: idProduto,
      Quantidade: quantidade,
    };
    serviceCarrinho.postCarrinho(produto_carrinho, token).then(() => {
      setAdded(true);
    });

    setTimeout(() => {
      setAdded(false);
    }, 1200);
  };

  const [produtoNovaGeracao, setProdutoNovaGeracao] =
    useState<ProdutoAtual | null>(null);
  const [cores, setCores] = useState<ModelosOption[] | null>(null);
  const [novaGeracao, setNovaGeracao] = useState<ProdutoAtual[] | null>(null);
  const [produtosAleatorios, setProdutosAleatorios] = useState<
    ProdutoNovo[] | null
  >(null);
  const [produtosPromocoes, setProdutosPromocoes] =
    useState<ProdutosResponse>();
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const service = new ProdutoService();

  async function carregarPromocoes(pagina: number = 1) {
    const resultado: ProdutosResponse = await service.getProdutosPromocao(
      pagina,
      3
    );
    if (resultado) {
      console.log(resultado);
      setProdutosPromocoes(resultado);
      setTotalPaginas(resultado.totalPaginas);
      setPagina(pagina);
    }
  }

  async function buscaProdutoAleatoros() {
    await service.getProdutosVariados(3).then((res: ProdutoNovo[]) => {
      setProdutosAleatorios(res);
    });
  }

  async function buscaProduto(id: number) {
    const prod = await getProduto(id);
    setProdutoNovaGeracao(prod ?? null);
  }

  async function getCores(id: number) {
    const cores = await getCoresProduto(id);
    setCores(cores ?? null);
  }

  async function getNovaGeracao() {
    const prod = await getProdutosNovaGeracao();
    setNovaGeracao(prod ?? null);
  }

  async function buscaProdutoPorCor(produtoId: number, modeloId: number) {
    const prod = await getProdutosPorProdutoIdEModeloId(produtoId, modeloId);
    setProdutoNovaGeracao(prod ?? null);
  }

  return (
    <Box sx={{ bgcolor: "#0a0a0a", color: "#fff", width: "100%" }}>
      <ModalInicial />
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 4, md: 6 }, textAlign: "center" }}
      >
        <Typography
          level="h1"
          sx={{
            fontSize: { xs: "1.9rem", md: "3.2rem" },
            fontWeight: 700,
            mb: 3,
          }}
        >
          Nova Geração
        </Typography>
        <Stack
          sx={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1,
            mb: 3,
          }}
        >
          {novaGeracao?.map((ng, index) => (
            <Box
              key={index}
              onClick={() => {
                buscaProduto(ng.id);
                getCores(ng.id);
              }}
              sx={{
                px: 2,
                py: 1,
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.25)",
                cursor: "pointer",
                width: "170px",
                textAlign: "center",
                backgroundColor:
                  produtoNovaGeracao?.id === ng.id
                    ? "rgba(255,255,255,0.10)"
                    : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              <Typography level="body-sm">{ng.nomeProduto}</Typography>
            </Box>
          ))}
        </Stack>
        <Box
          sx={{
            width: "100%",
            height: { xs: 380, md: 600 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            component="img"
            src={produtoNovaGeracao?.modelos?.[0]?.image ?? "/atual.png"}
            alt={produtoNovaGeracao?.nomeProduto}
            sx={{
              width: "100%",
              height:
                produtoNovaGeracao?.id === 7
                  ? "100%"
                  : produtoNovaGeracao?.id === 10
                  ? "95%"
                  : "90%",
              objectFit: "contain",
              animation: "fadeIn 1s ease-in-out",
              "@keyframes fadeIn": {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            }}
          />
        </Box>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mt: 2, mb: 4 }}
        >
          {cores?.map((cor) => (
            <Tooltip key={cor.id} title={cor.colorName} arrow>
              <Box
                onClick={() =>
                  buscaProdutoPorCor(produtoNovaGeracao?.id ?? 0, cor.id)
                }
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  bgcolor: cor.color,
                  border: "2px solid rgba(255,255,255,0.4)",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          ))}
        </Stack>

        {produtoNovaGeracao && (
          <Button
            onClick={() =>
              (window.location.href = `/compra?produtoId=${produtoNovaGeracao?.modelos?.[0]?.idProduto}`)
            }
            sx={{
              px: 4,
              py: 1.5,
              bgcolor: "#fff",
              color: "#000",
              fontWeight: 700,
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            Comprar
          </Button>
        )}
      </Container>
      <Box sx={{ width: "100%", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            level="h2"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: { xs: "1.7rem", md: "2.2rem" },
            }}
          >
            Produtos Variados
          </Typography>

          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            slidesPerView={1}
            centeredSlides
            loop
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            speed={900}
            style={{
              width: "100%",
              height: "auto",
              minHeight: "600px",
              paddingBottom: "40px",
            }}
          >
            {produtosAleatorios?.map((p, i) => (
              <SwiperSlide key={i}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  alignItems="center"
                  justifyContent="center"
                  spacing={{ xs: 2, md: 4 }}
                  sx={{
                    width: "100%",
                    height: "100%",
                    px: 2,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={p.imagens?.[0]?.caminho ?? ""}
                      alt={p.nomeProduto}
                      sx={{
                        width: { xs: "70%", md: "500px" },
                        height: { xs: "280px", md: "500px" },
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      color: "#fff",
                      textAlign: { xs: "center", md: "left" },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <Typography level="h4" sx={{ mb: 1 }}>
                      {p.nomeProduto}
                    </Typography>

                    <Typography level="body-sm" sx={{ opacity: 0.75 }}>
                      {p.descricao}
                    </Typography>

                    <Typography sx={{ mt: 2, fontWeight: 700 }}>
                      {formatarDinheiro(p.valor ?? 0)}
                    </Typography>

                    <Button
                      sx={{
                        mt: 2,
                        bgcolor: "#fff",
                        color: "#000",
                        fontWeight: 700,
                        textTransform: "none",
                        "&:hover": { bgcolor: "#f5f5f5" },
                      }}
                      onClick={() =>
                        (window.location.href = `/compra?produtoId=${p.id}`)
                      }
                    >
                      Comprar
                    </Button>
                  </Box>
                </Stack>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          level="h2"
          sx={{
            mb: 4,
            textAlign: "center",
            fontWeight: 700,
            fontSize: { xs: "1.7rem", md: "2rem" },
          }}
        >
          Promoções
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {produtosPromocoes?.itens.map((p) => (
            <Card
              key={p.id}
              sx={{
                p: 2,
                bgcolor: "#121212",
                borderRadius: "18px",
                textAlign: "center",
              }}
            >
              <Box
                component="img"
                src={p.imagens?.[0]?.caminho ?? ""}
                alt={p.imagens?.[0]?.descricao ?? ""}
                sx={{
                  width: "100%",
                  height: 160,
                  objectFit: "contain",
                }}
              />

              <Typography level="h4" sx={{ mt: 2 }}>
                {p.nomeProduto}
              </Typography>

              <Typography level="body-sm" sx={{ opacity: 0.72 }}>
                {p.descricao}
              </Typography>

              <Stack direction="row" spacing={1} justifyContent="center" mt={1}>
                <Typography>{formatarDinheiro(p.valor ?? 0)}</Typography>
                <Typography
                  sx={{ textDecoration: "line-through", opacity: 0.6 }}
                >
                  {formatarDinheiro(p.valorOriginal)}
                </Typography>
              </Stack>

              <Button
                onClick={() =>
                  (window.location.href = `/compra?produtoId=${p.id}`)
                }
                sx={{
                  mt: 2,
                  bgcolor: "#fff",
                  color: "#000",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                Comprar
              </Button>
              <Button
                color="primary"
                onClick={() => handleClick(p.id, 1)}
                sx={{
                  overflow: "hidden",
                  position: "relative",
                  transition: "all 0.3s ease",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    transform: added ? "translateY(-40px)" : "translateY(0)",
                    opacity: added ? 0 : 1,
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
                    transform: added ? "translateY(0)" : "translateY(40px)",
                    opacity: added ? 1 : 0,
                    transition: "all 0.3s ease",
                  }}
                >
                  <CheckIcon />
                  Adicionado!
                </Box>
              </Button>
            </Card>
          ))}
        </Box>

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          mt={4}
        >
          {Array.from({ length: totalPaginas }).map((_, index) => (
            <Box
              key={index}
              onClick={() => carregarPromocoes(index + 1)}
              sx={{
                width: pagina === index + 1 ? 16 : 12,
                height: pagina === index + 1 ? 16 : 12,
                borderRadius: "50%",
                cursor: "pointer",
                transition: "all 0.25s ease",
                backgroundColor:
                  pagina === index + 1 ? "#fff" : "rgba(255,255,255,0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.6)",
                  transform: "scale(1.2)",
                },
              }}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
