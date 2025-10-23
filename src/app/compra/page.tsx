"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Chip,
  Stack,
  Modal,
  Sheet,
  ModalClose,
  AspectRatio,
  IconButton,
  ModalDialog,
} from "@mui/joy";
import { Produto as p } from "../../types/produto.type";
import { getProdutosPorProdutoIdEModeloId } from "@/services/produtos/produtos.service";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";

export default function Produto() {
  const [produto, setProduto] = React.useState<p | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [imagemSelecionada, setImagemSelecionada] = React.useState<number>(0);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoParam = urlParams.get("produtoId");
    const modeloParam = urlParams.get("modeloId");

    if (produtoParam && modeloParam) {
      const produtoId = parseInt(produtoParam, 10);
      const modeloId = parseInt(modeloParam, 10);

      getProdutosPorProdutoIdEModeloId(produtoId, modeloId).then((prod) => {
        if (prod) {
          setProduto(prod);
        }
      });
    }
  }, []);

  if (!produto) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "neutral.500",
        }}
      >
        <Typography level="body-lg">Carregando produto...</Typography>
      </Box>
    );
  }

  const precoComDesconto = produto.valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const precoOriginal = produto.valorOriginal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const handleComprar = () => {
    const mensagem = `Olá, gostaria de comprar o produto: ${produto.nomeProduto}`;
    window.location.href = `https://wa.me/5511951663573?text=${encodeURIComponent(
      mensagem
    )}`;
  };

  const imagens = produto.modelos?.map((m) => m.image) || [
    produto.modelos?.[0]?.image,
  ];

  return (
    <main>
      <Box
        component="section"
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: 3,
          py: { xs: 4, md: 8 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
        }}
      >
        {/* IMAGEM PRINCIPAL */}
        <Box
          component="img"
          src={produto.modelos?.[0]?.image}
          alt={produto.nomeProduto}
          onClick={() => setOpen(true)}
          sx={{
            width: "50%",
            height: "auto",
            objectFit: "contain",
            borderRadius: "lg",
            boxShadow: "md",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.03)",
            },
            cursor: "zoom-in",
          }}
        />

        {/* DETALHES */}
        <Box sx={{ flex: 1 }}>
          <Typography
            level="h2"
            sx={{
              textAlign: "center",
              mb: 4,
              fontSize: "2rem",
              fontWeight: 400,
              color: "rgba(255,255,255,0.96)",
            }}
          >
            {produto.nomeProduto}
          </Typography>
          <Typography level="body-lg" color="neutral" sx={{ mb: 3 }}>
            {produto.descricao}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography
              level="h3"
              sx={{ color: "success.600", fontWeight: 600 }}
            >
              {precoComDesconto}
            </Typography>
            {produto.desconto > 0 && (
              <Typography
                level="body-md"
                sx={{
                  textDecoration: "line-through",
                  color: "neutral.500",
                }}
              >
                {precoOriginal}
              </Typography>
            )}
          </Stack>

          {produto.desconto > 0 && (
            <Chip
              color="success"
              variant="soft"
              sx={{ mt: 1, fontWeight: 600 }}
            >
              -
              {produto.desconto.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
              de desconto
            </Chip>
          )}

          <Divider sx={{ my: 4 }} />

          {/* SELEÇÃO DE CORES */}
          {produto.modelos && produto.modelos.length > 1 && (
            <Box
              sx={{
                mb: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography level="body-md" sx={{ mb: 1 }}>
                Cores disponíveis:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {produto.modelos.map((modelo) => (
                  <Box
                    key={modelo.id}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: modelo.color,
                      border: "2px solid #ddd",
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.15)",
                        borderColor: "primary.solidBg",
                      },
                    }}
                    title={modelo.colorName}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Button
            size="lg"
            color="primary"
            variant="solid"
            onClick={handleComprar}
            sx={{
              mt: 2,
              px: 5,
              fontWeight: 600,
              borderRadius: "lg",
              textTransform: "none",
              boxShadow: "sm",
              "&:hover": {
                boxShadow: "md",
                backgroundColor: "#fff",
                opacity: 0.8
              },
              bgcolor: "#fff",
              color: "#000"
            }}
          >
            Comprar via WhatsApp
          </Button>
        </Box>
      </Box>

      {/* MODAL DE IMAGEM */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(6px)",
          bgcolor: "rgba(0,0,0,0.85)",
          p: { xs: 1, sm: 3 },
        }}
      >
        <ModalDialog
          variant="solid"
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            bgcolor: "#121212",
            borderRadius: "xl",
            boxShadow: "lg",
            maxWidth: "95vw",
            maxHeight: "90vh",
            p: { xs: 2, sm: 4 },
            color: "#fff",
            overflow: "hidden",
          }}
        >
          <ModalClose
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(4px)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          />

          {/* MINIATURAS */}
          <Stack
            spacing={1.5}
            sx={{
              maxHeight: "80vh",
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": {
                width: 6,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 3,
              },
            }}
          >
            {imagens.map((img, index) => (
              <AspectRatio
                key={index}
                ratio="1/1"
                sx={{
                  width: 90,
                  borderRadius: "md",
                  overflow: "hidden",
                  border:
                    imagemSelecionada === index
                      ? "2px solid var(--joy-palette-primary-solidBg)"
                      : "2px solid rgba(255,255,255,0.15)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.08)",
                    borderColor: "var(--joy-palette-primary-solidBg)",
                  },
                }}
                onClick={() => setImagemSelecionada(index)}
              >
                <img
                  src={img}
                  alt={`imagem ${index}`}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </AspectRatio>
            ))}
          </Stack>

          {/* IMAGEM PRINCIPAL (agora com Swiper) */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "85vw", md: "75vw" },
              maxHeight: "80vh",
            }}
          >
            {/* Botão esquerda */}
            <IconButton
              className="prev-btn"
              size="lg"
              variant="soft"
              color="neutral"
              sx={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.1)",
                color: "#fff",
                zIndex: 10,
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              <ChevronLeft />
            </IconButton>

            {/* Swiper apenas na imagem principal */}
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: ".next-btn",
                prevEl: ".prev-btn",
              }}
              slidesPerView={1}
              loop={true}
              speed={800}
              style={{
                width: "100%",
                maxWidth: 900,
                height: "100%",
                borderRadius: "1rem",
                overflow: "hidden",
              }}
              onSlideChange={(swiper) => setImagemSelecionada(swiper.realIndex)}
            >
              {imagens.map((img, index) => (
                <SwiperSlide
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#000",
                  }}
                >
                  <img
                    src={img}
                    alt={`Imagem ${index}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "80vh",
                      objectFit: "contain",
                      borderRadius: "1rem",
                      transition: "transform 0.4s ease",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Botão direita */}
            <IconButton
              className="next-btn"
              size="lg"
              variant="soft"
              color="neutral"
              sx={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.1)",
                color: "#fff",
                zIndex: 10,
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </ModalDialog>
      </Modal>
    </main>
  );
}
