"use client";
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  WhatsApp,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Stack,
  Typography,
  Link,
  Divider,
  IconButton,
} from "@mui/joy";

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
          <Box sx={{ maxWidth: 320 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Typography
                level="h4"
                sx={{ mb: 1, fontWeight: 700, color: "background.body" }}
              >
                IMPORT
              </Typography>
              <Box
                component="img"
                src={"logo-import.png"}
                alt={"Logo"}
                sx={{
                  width: "10%",
                  height: "10%",
                }}
              />
              <Typography
                level="h4"
                sx={{ mb: 1, fontWeight: 700, color: "background.body" }}
              >
                IMPORTA
              </Typography>
            </Box>

            <Typography
              level="body-sm"
              sx={{ opacity: 0.7, color: "background.tooltip" }}
            >
              Sua loja de tecnologia com os melhores produtos Apple, Sony e
              muito mais. Encontre ofertas exclusivas e atendimento
              especializado.
            </Typography>
          </Box>
          <Stack spacing={1}>
            <Typography
              level="title-md"
              sx={{ mb: 1, fontWeight: 600, color: "background.body" }}
            >
              Navegação
            </Typography>
            <Link
              href="/inicio"
              underline="none"
              sx={{ color: "rgba(255,255,255,0.8)" }}
            >
              Início
            </Link>
            <Link
              href="/iphones"
              underline="none"
              sx={{ color: "rgba(255,255,255,0.8)" }}
            >
              Iphones
            </Link>
            <Link
              href="/macs"
              underline="none"
              sx={{ color: "rgba(255,255,255,0.8)" }}
            >
              Macs
            </Link>
            <Link
              href="/acessorios"
              underline="none"
              sx={{ color: "rgba(255,255,255,0.8)" }}
            >
              Acessórios
            </Link>
            <Link
              href="/outros"
              underline="none"
              sx={{ color: "rgba(255,255,255,0.8)" }}
            >
              Outros
            </Link>
          </Stack>
          <Stack spacing={1}>
            <Typography
              level="title-md"
              sx={{ mb: 1, fontWeight: 600, color: "background.body" }}
            >
              Contato
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Mail fontSize="small" />
              <Typography level="body-sm" sx={{ color: "background.body" }}>
                importtimporta@gmail.com.br
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Phone fontSize="small" />
              <Typography level="body-sm" sx={{ color: "background.body" }}>
                (11) 95166-3573
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography
              level="title-md"
              sx={{ mb: 1, fontWeight: 600, color: "background.body" }}
            >
              Siga-nos
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                component="a"
                href="https://www.instagram.com/importtimporta"
                sx={{
                  bgcolor: "background.body",
                  "&:hover": { bgcolor: "background.level2" },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component="a"
                href="https://wa.me/5511951663573"
                sx={{
                  bgcolor: "background.body",
                  "&:hover": { bgcolor: "background.level2" },
                }}
              >
                <WhatsApp />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 2 }} />
        <Typography
          level="body-xs"
          sx={{
            textAlign: "center",
            color: "background.body",
          }}
        >
          © {new Date().getFullYear()} importtimporta — Todos os direitos
          reservados.
        </Typography>
      </Container>
    </Box>
  );
}
