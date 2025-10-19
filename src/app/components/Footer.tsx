"use client";
import { Phone, Mail, Facebook, Instagram, Twitter } from "@mui/icons-material";
import { Box, Container, Stack, Typography, Link, Divider, IconButton } from "@mui/joy";

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "#0a0a0a",
        color: "background.body",
        pt: 6,
        pb: 3,
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={4}
          sx={{ pb: 4 }}
        >
          {/* Coluna 1 - Logo e Descrição */}
          <Box sx={{ maxWidth: 320 }}>
            <Typography level="h4" sx={{ mb: 1, fontWeight: 700, color: "background.body" }}>
              SmartCell Store
            </Typography>
            <Typography level="body-sm" sx={{ opacity: 0.7, color: "background.tooltip" }}>
              Sua loja de tecnologia com os melhores produtos Apple, Sony e muito mais. 
              Encontre ofertas exclusivas e atendimento especializado.
            </Typography>
          </Box>

          {/* Coluna 2 - Links */}
          <Stack spacing={1}>
            <Typography level="title-md" sx={{ mb: 1, fontWeight: 600, color: "background.body" }}>
              Navegação
            </Typography>
            <Link href="/" underline="none" sx={{ color: "rgba(255,255,255,0.8)" }}>
              Início
            </Link>
            <Link href="/produtos" underline="none" sx={{ color: "rgba(255,255,255,0.8)" }}>
              Produtos
            </Link>
            <Link href="/promocoes" underline="none" sx={{ color: "rgba(255,255,255,0.8)" }}>
              Promoções
            </Link>
            <Link href="/contato" underline="none" sx={{ color: "rgba(255,255,255,0.8)" }}>
              Contato
            </Link>
          </Stack>

          {/* Coluna 3 - Contato */}
          <Stack spacing={1}>
            <Typography level="title-md" sx={{ mb: 1, fontWeight: 600, color: "background.body" }}>
              Contato
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Mail fontSize="small" />
              <Typography level="body-sm" sx={{ color: "background.body" }}>suporte@smartcell.com.br</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Phone fontSize="small" />
              <Typography level="body-sm" sx={{ color: "background.body" }}>(11) 99999-9999</Typography>
            </Stack>
          </Stack>

          {/* Coluna 4 - Redes sociais */}
          <Stack spacing={1}>
            <Typography level="title-md" sx={{ mb: 1, fontWeight: 600, color: "background.body" }}>
              Siga-nos
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                component="a"
                href="#"
                sx={{
                  bgcolor: "background.body",
                  "&:hover": { bgcolor: "background.level2" },
                }}
              >
                <Facebook/>
              </IconButton>
              <IconButton
                component="a"
                href="#"
                sx={{
                  bgcolor: "background.body",
                  "&:hover": { bgcolor: "background.level2" },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component="a"
                href="#"
                sx={{
                  bgcolor: "background.body",
                  "&:hover": { bgcolor: "background.level2" },
                }}
              >
                <Twitter />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 2 }} />

        {/* Rodapé inferior */}
        <Typography
          level="body-xs"
          sx={{
            textAlign: "center",
            color: "background.body",
          }}
        >
          © {new Date().getFullYear()} importtimporta Store — Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
}
