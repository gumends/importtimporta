"use client";
import {
  Phone,
  Mail,
  Instagram,
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
                sx={{ mb: 1, fontWeight: 700,  }}
              >
                IMPORT
              </Typography>
              <Box
                component="img"
                src={"/identidades/logo-import.png"}
                alt={"Logo"}
                sx={{
                  width: "10%",
                  height: "10%",
                }}
              />
              <Typography
                level="h4"
                sx={{ mb: 1, fontWeight: 700,  }}
              >
                IMPORTA
              </Typography>
            </Box>

            <Typography
              level="body-sm"
              sx={{ opacity: 0.7 }}
            >
              Sua loja de tecnologia com os melhores produtos Apple, Sony e
              muito mais. Encontre ofertas exclusivas e atendimento
              especializado.
            </Typography>
          </Box>
          <Stack spacing={1}>
            <Typography
              level="title-md"
              sx={{ mb: 1, fontWeight: 600,  }}
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
              sx={{ mb: 1, fontWeight: 600}}
            >
              Contato
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Mail fontSize="small" />
              <Typography level="body-sm" >
                importtimporta@gmail.com.br
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Phone fontSize="small" />
              <Typography level="body-sm" >
                (11) 95166-3573
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography
              level="title-md"
              sx={{ mb: 1, fontWeight: 600,  }}
            >
              Siga-nos
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                component="a"
                href="https://www.instagram.com/importtimporta"
                sx={{
                  "&:hover": { bgcolor: "background.level2" },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component="a"
                href="https://wa.me/5511951663573"
                sx={{
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
          }}
        >
          © {new Date().getFullYear()} importtimporta — Todos os direitos
          reservados.
        </Typography>
      </Container>
    </Box>
  );
}
