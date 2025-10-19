"use client";
import { Box, Button, Container, Typography, Stack, Card } from "@mui/joy";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { useEffect } from "react";

interface Promocao {
  nomeProduto: string;
  image: string;
  precoComDesconto: string;
  precoSemDesconto: string;
  descricao: string;
}

export default function Inicio() {
  useEffect(() => {}, []);

  const promocoes: Promocao[] = [
    {
      nomeProduto: "Iphone 15",
      image: "/promocoes/iphone-15.png",
      precoComDesconto: "R$ 9.999,00",
      precoSemDesconto: "R$ 10.999,00",
      descricao: "O melhor iPhone de todos os tempos",
    },
    {
      nomeProduto: "Apple Watch Series 9",
      image: "/promocoes/apple_watch.png",
      precoComDesconto: "R$ 1.999,00",
      precoSemDesconto: "R$ 2.499,00",
      descricao: "Um relógio inteligente para o seu dia a dia",
    },
    {
      nomeProduto: "AirPods Pro",
      image: "/promocoes/airpods.png",
      precoComDesconto: "R$ 299,00",
      precoSemDesconto: "R$ 399,00",
      descricao: "Fones de ouvido com cancelamento de ruído",
    },
    {
      nomeProduto: "MacBook Pro",
      image: "/promocoes/MacBook.png",
      precoComDesconto: "R$ 4.499,00",
      precoSemDesconto: "R$ 5.999,00",
      descricao: "O laptop mais poderoso da Apple",
    },
    {
      nomeProduto: "iPad",
      image: "/promocoes/ipad.png",
      precoComDesconto: "R$ 3.499,00",
      precoSemDesconto: "R$ 4.299,00",
      descricao: "O tablet mais avançado do mercado",
    },
    {
      nomeProduto: "PlayStation 5",
      image: "/promocoes/playstation_5.png",
      precoComDesconto: "R$ 4.499,00",
      precoSemDesconto: "R$ 5.499,00",
      descricao: "O console de última geração da Sony",
    },
  ];

  const produtosVariados: Promocao[] = [
    ...promocoes,
    {
      nomeProduto: "JBL Caixa de Som",
      image: "/promocoes/jbl.png",
      precoComDesconto: "R$ 249,00",
      precoSemDesconto: "R$ 299,00",
      descricao: "Som imersivo para jogos e festas",
    },
    {
      nomeProduto: "Smart TV 4K",
      image: "/promocoes/tv.png",
      precoComDesconto: "R$ 2.999,00",
      precoSemDesconto: "R$ 3.499,00",
      descricao: "Imagem cristalina em 4K UHD",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#0a0a0a", color: "#fff", width: "100%" }}>
      {/* HERO */}
      <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
        <Typography
          level="h1"
          sx={{
            fontSize: { xs: "2.2rem", md: "3.5rem" },
            fontWeight: "700",
            mb: 3,
            color: "rgba(255,255,255,0.96)", // título mais forte (branco forte)
          }}
        >
          iPhone 17 Pro
        </Typography>
        <Box
          component="img"
          src="/iphone-17.png"
          alt="Produto destaque"
          sx={{
            width: "100%",
            maxWidth: 1000,
            height: "auto",
            objectFit: "contain",
            mx: "auto",
            mb: 3,
          }}
        />
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="solid"
            sx={{ borderRadius: "50px", px: 3, bgcolor: "#fff", color: "#000" }}
          >
            Saiba mais
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "50px",
              px: 3,
              borderColor: "#fff",
              color: "#fff",
            }}
          >
            Comprar
          </Button>
        </Stack>
      </Container>

      {/* PRODUTOS VARIADOS (carrossel alinhado ao container) */}
      <Box sx={{ width: "100%", backgroundColor: "#0a0a0a", py: 8 }}>
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Typography
            level="h2"
            sx={{
              textAlign: "center",
              mb: 4,
              fontSize: "2rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.96)", // título mais forte
            }}
          >
            Produtos variados
          </Typography>

          <Box
            sx={{
              width: "100%",
              ".swiper": { width: "100%" },
              ".swiper-button-prev, .swiper-button-next": {
                color: "#1ea7ff",
                border: "0",
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "transparent",
                boxShadow: "none",
                top: "50%",
                transform: "translateY(-50%)",
              },
              ".swiper-button-prev": { left: 8 },
              ".swiper-button-next": { right: 8 },
              ".swiper-button-prev::after, .swiper-button-next::after": {
                fontSize: 28,
              },
            }}
          >
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              slidesPerView={1}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              speed={900}
              style={{ width: "100%", height: "400px" }}
            >
              {produtosVariados.map((p, i) => (
                <SwiperSlide key={i}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 4,
                      width: "100%",
                      maxWidth: 980,
                      mx: "auto",
                      px: { xs: 2, md: 0 },
                      height: "100%",
                    }}
                  >
                    <Box
                      component="img"
                      src={p.image}
                      alt={p.nomeProduto}
                      sx={{
                        width: "100%",
                        maxWidth: 620,
                        height: "auto",
                        objectFit: "contain",
                        mx: "auto",
                      }}
                    />
                    <Box
                      sx={{
                        textAlign: { xs: "center", md: "left" },
                        color: "rgba(255,255,255,0.96)", // nome do produto - branco mais forte
                      }}
                    >
                      <Typography level="h4" sx={{ mb: 1, fontWeight: 600, color: "rgba(255,255,255,0.95)" }}>
                        {p.nomeProduto}
                      </Typography>
                      <Typography
                        level="body-sm"
                        sx={{ mb: 2, color: "rgba(255,255,255,0.72)" }} // descrição mais fraca
                      >
                        {p.descricao}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent={{ xs: "center", md: "flex-start" }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            color: "rgba(255,255,255,0.95)",
                          }} // preço principal
                        >
                          {p.precoComDesconto}
                        </Typography>
                        <Typography
                          sx={{
                            textDecoration: "line-through",
                            opacity: 0.7,
                            color: "rgba(255,255,255,0.55)",
                          }} // riscado mais fraco
                        >
                          {p.precoSemDesconto}
                        </Typography>
                      </Stack>
                      <Button
                        variant="solid"
                        sx={{
                          mt: 3,
                          bgcolor: "#fff",
                          color: "#000",
                          mx: { xs: "auto", md: 0 },
                        }}
                      >
                        Comprar
                      </Button>
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Container>
      </Box>

      {/* PRODUTOS EM DESCONTO */}
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          py: 6,
        }}
      >
        <Typography
          level="h2"
          sx={{ mb: 4, fontWeight: "bold", color: "rgba(255,255,255,0.96)" }}
        >
          Produtos em desconto
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {promocoes.map((promocao, index) => (
            <Card
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                p: 3,
                width: "100%",
                maxWidth: 320,
                bgcolor: "#121212",
                borderRadius: "24px",
              }}
            >
              <Box
                component="img"
                src={promocao.image}
                alt={promocao.nomeProduto}
                sx={{
                  width: "100%",
                  height: 180,
                  objectFit: "contain",
                }}
              />
              <Typography level="h4" sx={{ color: "rgba(255,255,255,0.95)" }}>
                {promocao.nomeProduto}
              </Typography>
              <Typography
                level="body-sm"
                sx={{ opacity: 0.8, color: "rgba(255,255,255,0.72)" }}
              >
                {promocao.descricao}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Typography sx={{ color: "rgba(255,255,255,0.95)" }}>
                  {promocao.precoComDesconto}
                </Typography>
                <Typography
                  sx={{
                    textDecoration: "line-through",
                    opacity: 0.6,
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  {promocao.precoSemDesconto}
                </Typography>
              </Stack>
              <Button
                variant="solid"
                sx={{
                  bgcolor: "#fff",
                  color: "#000",
                  "&:hover": { bgcolor: "#f2f2f2" },
                }}
              >
                Comprar
              </Button>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
