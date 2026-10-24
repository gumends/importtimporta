"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Container,
  CircularProgress,
  Alert,
} from "@mui/joy";
import NextLink from "next/link";
import {
  Person,
  Shop,
  ArrowForward,
  Storefront,
  DashboardCustomize,
} from "@mui/icons-material";
import { GoogleAuthService } from "@/services/auth/auth.service";
import { UserService } from "@/services/user/user.service";
import { ProdutoService } from "@/services/produto/produto.service";
import { Usuario } from "@/types/usuario.type";

const ADMIN_ROLE = 1;

type SecaoPainel = {
  titulo: string;
  descricao: string;
  href: string;
  icone: React.ReactNode;
  cor: string;
  rotuloMetrica: string;
  total: number | null;
};

export default function PainelAdministradorPage() {
  const auth = new GoogleAuthService();
  const userService = new UserService();
  const produtoService = new ProdutoService();

  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [totalProdutos, setTotalProdutos] = useState<number | null>(null);
  const [totalUsuarios, setTotalUsuarios] = useState<number | null>(null);
  const [acessoNegado, setAcessoNegado] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      try {
        const token = sessionStorage.getItem("auth_token");
        if (!token) {
          setAcessoNegado(true);
          return;
        }

        const me = await auth.me();
        if (!me?.email || me.role !== ADMIN_ROLE) {
          setAcessoNegado(true);
          return;
        }

        setUsuario(me);

        const [produtos, usuarios] = await Promise.all([
          produtoService.getProdutos({ pagina: 1 }),
          userService.getAllUser(1, 1).catch(() => null),
        ]);

        setTotalProdutos(produtos?.totalItens ?? 0);
        setTotalUsuarios(
          usuarios && "totalItens" in usuarios
            ? (usuarios as { totalItens: number }).totalItens
            : null,
        );
      } catch {
        setAcessoNegado(true);
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, []);

  if (carregando) {
    return (
      <Box sx={{ py: 14, display: "flex", justifyContent: "center" }}>
        <CircularProgress size="lg" />
      </Box>
    );
  }

  if (acessoNegado) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, px: 2 }}>
        <Alert color="danger" variant="soft" sx={{ mb: 2 }}>
          Esta área é exclusiva para administradores. Entre com uma conta Admin
          ou volte à loja.
        </Alert>
        <Button component={NextLink} href="/inicio" variant="soft">
          Ir para a loja
        </Button>
      </Container>
    );
  }

  const secoes: SecaoPainel[] = [
    {
      titulo: "Produtos",
      descricao:
        "Cadastre itens, ajuste preços, estoque e imagens do catálogo.",
      href: "/painel-administrador/produtos",
      icone: <Shop fontSize="large" />,
      cor: "#3b82f6",
      rotuloMetrica: "produtos no catálogo",
      total: totalProdutos,
    },
    {
      titulo: "Usuários",
      descricao:
        "Controle contas, permissões de admin e status de acesso.",
      href: "/painel-administrador/usuarios",
      icone: <Person fontSize="large" />,
      cor: "#8b5cf6",
      rotuloMetrica: "usuários cadastrados",
      total: totalUsuarios,
    },
  ];

  const primeiroNome = usuario?.name?.split(" ")[0] ?? "Admin";

  return (
    <Container
      maxWidth="lg"
      sx={{
        width: "100%",
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 3 },
        minHeight: "calc(100vh - 120px)",
      }}
    >
      <Stack spacing={4}>
        <Box
          sx={{
            position: "relative",
            borderRadius: "xl",
            p: { xs: 3, md: 4 },
            overflow: "hidden",
            border: "1px solid",
            borderColor: "rgba(255,255,255,0.08)",
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(10,10,10,0.6) 100%)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <DashboardCustomize sx={{ color: "#93c5fd", fontSize: 28 }} />
                <Chip size="sm" variant="soft" color="primary">
                  Admin
                </Chip>
              </Stack>
              <Typography level="h2" sx={{ fontWeight: 700, color: "#fff" }}>
                Olá, {primeiroNome}
              </Typography>
              <Typography level="body-md" sx={{ color: "neutral.400", mt: 0.5 }}>
                Central de gestão da Import Importa — escolha o que deseja
                administrar.
              </Typography>
            </Box>
            <Button
              component={NextLink}
              href="/inicio"
              variant="outlined"
              color="neutral"
              startDecorator={<Storefront />}
              sx={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              Ver loja
            </Button>
          </Stack>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Card
            variant="soft"
            color="primary"
            sx={{ flex: 1, bgcolor: "rgba(59,130,246,0.12)" }}
          >
            <Typography level="body-sm" sx={{ opacity: 0.85 }}>
              Produtos
            </Typography>
            <Typography level="h2" sx={{ fontWeight: 700 }}>
              {totalProdutos ?? "—"}
            </Typography>
          </Card>
          <Card
            variant="soft"
            sx={{
              flex: 1,
              bgcolor: "rgba(139,92,246,0.12)",
              borderColor: "rgba(139,92,246,0.25)",
            }}
          >
            <Typography level="body-sm" sx={{ opacity: 0.85 }}>
              Usuários
            </Typography>
            <Typography level="h2" sx={{ fontWeight: 700 }}>
              {totalUsuarios ?? "—"}
            </Typography>
          </Card>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2.5,
          }}
        >
          {secoes.map((secao) => (
            <Card
              key={secao.titulo}
              variant="outlined"
              sx={{
                bgcolor: "#121212",
                borderColor: "rgba(255,255,255,0.08)",
                transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: secao.cor,
                  boxShadow: `0 12px 40px ${secao.cor}22`,
                },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "lg",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: `${secao.cor}22`,
                        color: secao.cor,
                        flexShrink: 0,
                      }}
                    >
                      {secao.icone}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography level="title-lg" sx={{ color: "#fff" }}>
                        {secao.titulo}
                      </Typography>
                      <Typography level="body-sm" sx={{ color: "neutral.400", mt: 0.5 }}>
                        {secao.descricao}
                      </Typography>
                      {secao.total !== null && (
                        <Typography level="body-xs" sx={{ mt: 1, color: "neutral.500" }}>
                          {secao.total} {secao.rotuloMetrica}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                  <Button
                    component={NextLink}
                    href={secao.href}
                    variant="solid"
                    endDecorator={<ArrowForward />}
                    sx={{
                      alignSelf: "flex-start",
                      bgcolor: secao.cor,
                      "&:hover": { bgcolor: secao.cor, filter: "brightness(1.08)" },
                    }}
                  >
                    Abrir {secao.titulo.toLowerCase()}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Typography level="body-xs" textAlign="center" sx={{ color: "neutral.600", pb: 2 }}>
          Logado como {usuario?.email}
        </Typography>
      </Stack>
    </Container>
  );
}
