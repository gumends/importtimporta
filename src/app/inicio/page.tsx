"use client";

import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import ModalInicial from "../components/ModalInicial";
import {
  getCoresProduto,
  getProduto,
  getProdutosNovaGeracao,
  getProdutosPorProdutoIdEModeloId,
} from "@/services/produtos/produtos.service";
import { ModelosOption, ProdutoAtual } from "@/types/produtoAtual.type";
import { formatarDinheiro } from "@/utils/mascara_dinheiro";
import { ProdutoService } from "@/services/produto/produto.service";
import {
  ProdutosResponse,
  Produto as ProdutoNovo,
} from "@/types/ProdutoNovo.type";
import BotaoAdicionarCarrinho from "@/app/components/BotaoAdicionarCarrinho";

const btnPrimary = {
  bgcolor: "#f5f5f7",
  color: "#1d1d1f",
  fontWeight: 600,
  borderRadius: "999px",
  px: 3,
  "&:hover": { bgcolor: "#fff" },
};

const btnGhost = {
  color: "#2997ff",
  fontWeight: 500,
  borderRadius: "999px",
  "&:hover": { bgcolor: "rgba(41, 151, 255, 0.12)" },
};

/** Pro Max maior; Pro um pouco menor; Flip compacto na vitrine. */
const HERO_ESCALA_POR_MODELO: Record<number, number> = {
  7: 1.12,
  8: 0.94,
  10: 0.82,
};

export default function Inicio() {
  const router = useRouter();
  const service = new ProdutoService();

  const [produtoNovaGeracao, setProdutoNovaGeracao] =
    useState<ProdutoAtual | null>(null);
  const [cores, setCores] = useState<ModelosOption[] | null>(null);
  const [corSelecionada, setCorSelecionada] = useState<number | null>(null);
  const [novaGeracao, setNovaGeracao] = useState<ProdutoAtual[] | null>(null);
  const [produtosAleatorios, setProdutosAleatorios] = useState<
    ProdutoNovo[] | null
  >(null);
  const [produtosPromocoes, setProdutosPromocoes] =
    useState<ProdutosResponse>();
  const [paginaPromo, setPaginaPromo] = useState(1);
  const [totalPaginasPromo, setTotalPaginasPromo] = useState(1);

  const imagemAtual =
    produtoNovaGeracao?.modelos?.[0]?.image ?? "/atual.png";

  const escalaHero =
    HERO_ESCALA_POR_MODELO[produtoNovaGeracao?.id ?? 7] ?? 1;

  const selecionarModelo = useCallback(async (id: number) => {
    const prod = await getProduto(id);
    if (!prod) return;
    setProdutoNovaGeracao(prod);
    const listaCores = await getCoresProduto(id);
    setCores(listaCores ?? null);
    setCorSelecionada(listaCores?.[0]?.id ?? null);
  }, []);

  async function carregarPromocoes(pagina: number = 1) {
    const resultado = await service.getProdutosPromocao(pagina, 3);
    if (resultado) {
      setProdutosPromocoes(resultado);
      setTotalPaginasPromo(resultado.totalPaginas);
      setPaginaPromo(pagina);
    }
  }

  async function getNovaGeracao() {
    const prod = await getProdutosNovaGeracao();
    setNovaGeracao(prod ?? null);
    if (prod?.length) {
      await selecionarModelo(prod[0].id);
    }
  }

  useEffect(() => {
    void getNovaGeracao();
    void service.getProdutosVariados(3).then(setProdutosAleatorios);
    void carregarPromocoes();
  }, []);

  async function buscaProdutoPorCor(produtoId: number, modeloId: number) {
    setCorSelecionada(modeloId);
    const prod = await getProdutosPorProdutoIdEModeloId(produtoId, modeloId);
    setProdutoNovaGeracao(prod ?? null);
  }

  const idCompra = produtoNovaGeracao?.catalogoProdutoId ?? "";

  return (
    <Box sx={{ bgcolor: "#000", color: "#f5f5f7", width: "100%" }}>
      <ModalInicial />

      {/* Hero — linha iPhone 18 (altura da viewport, imagem em destaque) */}
      <Box
        component="section"
        sx={{
          position: "relative",
          boxSizing: "border-box",
          minHeight: {
            xs: "calc(100dvh - 92px)",
            sm: "calc(100dvh - 88px)",
            md: "calc(100dvh - 80px)",
          },
          display: "flex",
          flexDirection: "column",
          pt: { xs: 2.5, md: 3.5 },
          pb: { xs: 2.5, md: 3 },
          px: 2,
          textAlign: "center",
          overflow: "hidden",
          background:
            "radial-gradient(ellipse 90% 55% at 50% -15%, rgba(41, 151, 255, 0.22), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 30%, rgba(120, 80, 255, 0.12), transparent), #000",
        }}
      >
        <Container maxWidth="md" sx={{ flex: "0 0 auto" }}>
          <Chip
            size="sm"
            variant="soft"
            sx={{
              mb: 2,
              bgcolor: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.85)",
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            Linha iPhone 18 · Import Importa
          </Chip>

          <Typography
            sx={{
              fontSize: {
                xs: "clamp(1.75rem, 5.5vw, 2.5rem)",
                sm: "clamp(2.25rem, 4.5vw, 3.25rem)",
                md: "clamp(2.75rem, 4vw, 4rem)",
              },
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              mb: 1,
            }}
          >
            {produtoNovaGeracao?.nomeProduto ?? "iPhone 18"}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1.05rem", md: "1.25rem" },
              color: "rgba(245, 245, 247, 0.72)",
              maxWidth: 480,
              mx: "auto",
              lineHeight: 1.45,
            }}
          >
            {produtoNovaGeracao?.descricao ??
              "O futuro da linha iPhone, com acabamento premium e desempenho de última geração."}
          </Typography>

          {produtoNovaGeracao?.valor != null && (
            <Typography
              level="body-lg"
              sx={{ mt: 2, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}
            >
              A partir de {formatarDinheiro(produtoNovaGeracao.valor)}
            </Typography>
          )}

          <Stack
            direction="row"
            spacing={0.5}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: { xs: 2, md: 2.5 }, mb: 0, gap: 1 }}
          >
            {novaGeracao?.map((ng) => {
              const ativo = produtoNovaGeracao?.id === ng.id;
              return (
                <Button
                  key={ng.id}
                  size="sm"
                  variant={ativo ? "solid" : "plain"}
                  onClick={() => selecionarModelo(ng.id)}
                  sx={{
                    borderRadius: "999px",
                    fontWeight: 500,
                    fontSize: "0.8125rem",
                    ...(ativo
                      ? {
                          bgcolor: "rgba(255,255,255,0.14)",
                          color: "#fff",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                        }
                      : {
                          color: "rgba(255,255,255,0.65)",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                        }),
                  }}
                >
                  {ng.nomeProduto.replace(/^iPhone /i, "")}
                </Button>
              );
            })}
          </Stack>
        </Container>

        <Box
          sx={{
            position: "relative",
            flex: "1 1 auto",
            minHeight: 0,
            width: "100%",
            mx: "auto",
            mt: { xs: 1, md: 1.5 },
            mb: { xs: 0.5, md: 1 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 0, sm: 2 },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "min(85%, 520px)",
              height: "55%",
              bottom: "8%",
              background:
                "radial-gradient(circle, rgba(41,151,255,0.4) 0%, transparent 72%)",
              filter: "blur(48px)",
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${escalaHero})`,
              transformOrigin: "center center",
              transition: "transform 0.45s ease",
            }}
          >
            <Box
              component="img"
              src={imagemAtual}
              alt={produtoNovaGeracao?.nomeProduto ?? "iPhone 18"}
              sx={{
                position: "relative",
                display: "block",
                width: "auto",
                height: "100%",
                maxHeight: {
                  xs: "min(52vh, 520px)",
                  sm: "min(58vh, 640px)",
                  md: "min(62vh, 720px)",
                },
                maxWidth: {
                  xs: "min(88vw, 380px)",
                  sm: "min(72vw, 480px)",
                  md: "min(48vw, 560px)",
                  lg: "min(42vw, 640px)",
                },
                objectFit: "contain",
                transition: "opacity 0.45s ease",
                animation: "heroFloat 6s ease-in-out infinite",
                "@keyframes heroFloat": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-10px)" },
                },
              }}
            />
          </Box>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="center"
          sx={{ flex: "0 0 auto", mt: 0.5, mb: 1.5, minHeight: 36 }}
        >
          {cores?.map((cor) => {
            const selecionada = corSelecionada === cor.id;
            return (
              <IconButton
                key={cor.id}
                aria-label={cor.colorName}
                title={cor.colorName}
                size="sm"
                onClick={() =>
                  buscaProdutoPorCor(produtoNovaGeracao?.id ?? 0, cor.id)
                }
                sx={{
                  p: 0.5,
                  border: selecionada
                    ? "2px solid rgba(255,255,255,0.85)"
                    : "2px solid transparent",
                  borderRadius: "50%",
                }}
              >
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    bgcolor: cor.color,
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)",
                  }}
                />
              </IconButton>
            );
          })}
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          justifyContent="center"
          alignItems="center"
          sx={{ flex: "0 0 auto", pb: { xs: 0.5, md: 0 } }}
        >
          <Button
            disabled={!idCompra}
            sx={btnPrimary}
            endDecorator={<ArrowForwardIcon />}
            onClick={() => {
              if (idCompra) router.push(`/compra?produtoId=${idCompra}`);
            }}
          >
            Comprar agora
          </Button>
          <Button
            variant="plain"
            sx={btnGhost}
            onClick={() => router.push("/iphones")}
          >
            Ver todos os iPhones
          </Button>
        </Stack>
      </Box>

      {/* Destaques do catálogo */}
      {produtosAleatorios && produtosAleatorios.length > 0 && (
        <Box
          component="section"
          sx={{
            py: { xs: 8, md: 10 },
            bgcolor: "#0a0a0a",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Container maxWidth="lg">
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "flex-end" }}
              sx={{ mb: 4, gap: 2 }}
            >
              <Box>
                <Typography
                  level="body-sm"
                  sx={{
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    mb: 0.5,
                  }}
                >
                  Curadoria
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Destaques para você
                </Typography>
              </Box>
              <Button
                variant="plain"
                endDecorator={<ChevronRightIcon />}
                onClick={() => router.push("/iphones")}
                sx={{ color: "#2997ff" }}
              >
                Explorar loja
              </Button>
            </Stack>

            <Swiper
              modules={[Autoplay, Pagination]}
              pagination={{ clickable: true }}
              slidesPerView={1}
              spaceBetween={24}
              autoplay={{ delay: 5500, disableOnInteraction: false }}
              style={{ paddingBottom: 48 }}
            >
              {produtosAleatorios.map((p) => (
                <SwiperSlide key={p.id}>
                  <Sheet
                    variant="outlined"
                    sx={{
                      borderRadius: "24px",
                      borderColor: "rgba(255,255,255,0.1)",
                      bgcolor: "rgba(255,255,255,0.03)",
                      overflow: "hidden",
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      minHeight: { md: 380 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: { xs: 3, md: 4 },
                        bgcolor: "rgba(0,0,0,0.35)",
                      }}
                    >
                      <Box
                        component="img"
                        src={p.imagens?.[0]?.caminho ?? ""}
                        alt={p.nomeProduto}
                        sx={{
                          width: "100%",
                          maxWidth: 360,
                          maxHeight: 320,
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                    <Stack
                      justifyContent="center"
                      sx={{ p: { xs: 3, md: 5 }, textAlign: { xs: "center", md: "left" } }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "1.5rem", md: "1.85rem" },
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                          mb: 1,
                        }}
                      >
                        {p.nomeProduto}
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.65)",
                          lineHeight: 1.5,
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.descricao}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "1.25rem", fontWeight: 600, mb: 2.5 }}
                      >
                        {formatarDinheiro(p.valor ?? 0)}
                      </Typography>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        justifyContent={{ xs: "center", md: "flex-start" }}
                      >
                        <Button
                          sx={{ ...btnPrimary, minWidth: 160 }}
                          onClick={() =>
                            router.push(`/compra?produtoId=${p.id}`)
                          }
                        >
                          Comprar
                        </Button>
                        <BotaoAdicionarCarrinho
                          idProduto={p.id}
                          fullWidth={false}
                          sx={{ minWidth: 200, borderRadius: "999px" }}
                        />
                      </Stack>
                    </Stack>
                  </Sheet>
                </SwiperSlide>
              ))}
            </Swiper>
          </Container>
        </Box>
      )}

      {/* Promoções */}
      {produtosPromocoes && produtosPromocoes.itens.length > 0 && (
        <Box
          component="section"
          sx={{
            py: { xs: 8, md: 10 },
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Container maxWidth="lg">
            <Typography
              sx={{
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                fontWeight: 700,
                letterSpacing: "-0.02em",
                textAlign: "center",
                mb: 1,
              }}
            >
              Ofertas especiais
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                color: "rgba(255,255,255,0.55)",
                mb: 5,
                maxWidth: 420,
                mx: "auto",
              }}
            >
              Preços exclusivos por tempo limitado na Import Importa.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 2.5,
              }}
            >
              {produtosPromocoes.itens.map((p) => {
                const temDesconto =
                  p.valorOriginal > (p.valor ?? 0) && p.valorOriginal > 0;
                const pct =
                  temDesconto && p.valor
                    ? Math.round(
                        ((p.valorOriginal - p.valor) / p.valorOriginal) * 100,
                      )
                    : 0;

                return (
                  <Sheet
                    key={p.id}
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: "20px",
                      borderColor: "rgba(255,255,255,0.1)",
                      bgcolor: "rgba(255,255,255,0.02)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      transition: "transform 0.25s ease, border-color 0.25s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: "rgba(255,255,255,0.18)",
                      },
                    }}
                  >
                    {temDesconto && (
                      <Chip
                        size="sm"
                        color="success"
                        variant="soft"
                        sx={{ mb: 1.5, fontWeight: 600 }}
                      >
                        −{pct}%
                      </Chip>
                    )}
                    <Box
                      component="img"
                      src={p.imagens?.[0]?.caminho ?? ""}
                      alt={p.nomeProduto}
                      sx={{
                        width: "100%",
                        height: 180,
                        objectFit: "contain",
                        mb: 2,
                      }}
                    />
                    <Typography
                      sx={{ fontWeight: 700, fontSize: "1.1rem", mb: 0.5 }}
                    >
                      {p.nomeProduto}
                    </Typography>
                    <Typography
                      level="body-sm"
                      sx={{
                        color: "rgba(255,255,255,0.55)",
                        mb: 2,
                        minHeight: "2.8em",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {p.descricao}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="baseline" mb={2}>
                      <Typography sx={{ fontWeight: 700, fontSize: "1.15rem" }}>
                        {formatarDinheiro(p.valor ?? 0)}
                      </Typography>
                      {temDesconto && (
                        <Typography
                          level="body-sm"
                          sx={{
                            textDecoration: "line-through",
                            color: "rgba(255,255,255,0.4)",
                          }}
                        >
                          {formatarDinheiro(p.valorOriginal)}
                        </Typography>
                      )}
                    </Stack>
                    <Stack spacing={1} width="100%">
                      <Button
                        fullWidth
                        sx={btnPrimary}
                        onClick={() =>
                          router.push(`/compra?produtoId=${p.id}`)
                        }
                      >
                        Comprar
                      </Button>
                      <BotaoAdicionarCarrinho idProduto={p.id} />
                    </Stack>
                  </Sheet>
                );
              })}
            </Box>

            {totalPaginasPromo > 1 && (
              <Stack
                direction="row"
                justifyContent="center"
                spacing={1}
                mt={4}
              >
                {Array.from({ length: totalPaginasPromo }).map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => carregarPromocoes(index + 1)}
                    sx={{
                      width: paginaPromo === index + 1 ? 10 : 8,
                      height: paginaPromo === index + 1 ? 10 : 8,
                      borderRadius: "50%",
                      cursor: "pointer",
                      bgcolor:
                        paginaPromo === index + 1
                          ? "#f5f5f7"
                          : "rgba(255,255,255,0.25)",
                      transition: "all 0.2s ease",
                    }}
                  />
                ))}
              </Stack>
            )}
          </Container>
        </Box>
      )}

      {/* CTA final */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
          px: 2,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(41,151,255,0.08) 100%)",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1.75rem", md: "2.5rem" },
            fontWeight: 700,
            letterSpacing: "-0.03em",
            mb: 1.5,
          }}
        >
          Tecnologia importada, confiança local.
        </Typography>
        <Typography
          sx={{ color: "rgba(255,255,255,0.6)", mb: 3, maxWidth: 520, mx: "auto" }}
        >
          iPhones, Macs e acessórios com curadoria Import Importa — atendimento
          humano e condições especiais.
        </Typography>
        <Button
          size="lg"
          sx={{ ...btnPrimary, px: 4 }}
          onClick={() => router.push("/iphones")}
        >
          Começar a comprar
        </Button>
      </Box>
    </Box>
  );
}
