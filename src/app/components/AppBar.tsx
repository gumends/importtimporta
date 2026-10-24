"use client";
import * as React from "react";
import {
  Box,
  Sheet,
  Button,
  Container,
  Typography,
  Badge,
} from "@mui/joy";
import { Menu as M } from "lucide-react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ExitToApp, Person } from "@mui/icons-material";
import LoginComponent from "./LoginComponent";
import BuscaProdutoHeader from "./BuscaProdutoHeader";
import { GoogleAuthService } from "@/services/auth/auth.service";
import { MenuResponse } from "@/types/menus.type";
import { UserService } from "@/services/user/user.service";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import MenuButton from "@mui/joy/MenuButton";
import IconButton from "@mui/joy/IconButton";
import {
  CARRINHO_ATUALIZADO_EVENT,
  CarrinhoService,
} from "@/services/carrinho/carrinho.service";

export default function AppBar() {
  const router = useRouter();
  const [pagina, setPagina] = React.useState("");
  const [openMenu, setOpenMenu] = React.useState(false);
  const [logado, setLogado] = React.useState(false);
  const [menus, setMenus] = React.useState<MenuResponse>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [quantidadeCarrinho, setQuantidadeCarrinho] = React.useState<number>(0);

  const googleAuth = new GoogleAuthService();
  const userService = new UserService();

  const serviceCarrihno = new CarrinhoService();

  const menu = [
    { label: "IPhone", path: "/iphones" },
    { label: "Mac", path: "/macs" },
    { label: "Acessórios", path: "/acessorios" },
    { label: "Outros", path: "/outros" },
  ];

  const logout = async () => {
    await googleAuth.logout().then(() => router.push("/"));
  };

  async function getMenus(email: string) {
    try {
      const response: MenuResponse = await userService.GetMenus(email);
      setMenus(Array.isArray(response) ? response : []);
    } catch {
      setMenus([]);
    }
  }

  const atualizarContagemCarrinho = async () => {
    try {
      const q = await serviceCarrihno.contarItens();
      setQuantidadeCarrinho(q);
    } catch {
      setQuantidadeCarrinho(CarrinhoService.getQuantidadeItensLocal());
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await googleAuth.me();

        if (!res?.email) {
          await atualizarContagemCarrinho();
          return;
        }

        setLogado(true);
        await getMenus(res.email);

        const token = sessionStorage.getItem("auth_token");
        if (token) {
          try {
            await serviceCarrihno.sincronizarCarrinhoLocalComApi(token);
          } catch {
            /* API indisponível ou token expirado — não bloqueia a loja */
          }
        }

        await atualizarContagemCarrinho();
      } catch {
        setLogado(false);
        setMenus([]);
        setQuantidadeCarrinho(CarrinhoService.getQuantidadeItensLocal());
      }
    };

    void init();
  }, []);

  useEffect(() => {
    const onCarrinhoAtualizado = () => {
      void atualizarContagemCarrinho();
    };
    window.addEventListener(CARRINHO_ATUALIZADO_EVENT, onCarrinhoAtualizado);
    return () =>
      window.removeEventListener(CARRINHO_ATUALIZADO_EVENT, onCarrinhoAtualizado);
  }, []);

  useEffect(() => {
    setPagina(window.location.pathname);
  }, []);

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        alignSelf: "stretch",
        bgcolor: "#000",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        pt: { xs: 1.5, md: 2 },
        pb: { xs: 2, md: 2 },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", px: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          p: { xs: 0.5, md: 1 },
          bgcolor: "transparent",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              onClick={() => router.push("/inicio")}
              component="img"
              src="/identidades/logo-import.png"
              sx={{
                width: 40,
                height: "auto",
                cursor: "pointer",
              }}
            />
            {menu.map((item, index) => (
              <Button
                key={index}
                onClick={() => (window.location.href = item.path)}
                variant={pagina === item.path ? "solid" : "plain"}
                size="sm"
                sx={{
                  borderRadius: "sm",
                  fontWeight: 500,
                  color:
                    pagina === item.path ? "#fff" : "rgba(255,255,255,0.7)",
                  bgcolor:
                    pagina === item.path
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <BuscaProdutoHeader largura={450} size="sm" />
            <LoginComponent
              openModal={openModal}
              onClose={() => setOpenModal(false)}
            />
            {!logado ? (
              <IconButton onClick={() => setOpenModal(true)}>
                <Person />
              </IconButton>
            ) : (
              <Dropdown>
                <MenuButton
                  slots={{ root: IconButton }}
                  slotProps={{
                    root: { variant: "outlined", color: "neutral" },
                  }}
                >
                  <Person />
                </MenuButton>
                <Menu>
                  {menus.map((menu) => (
                    <MenuItem
                      key={menu.id}
                      onClick={() => router.push(menu.link)}
                    >
                      {menu.name}
                    </MenuItem>
                  ))}
                  <MenuItem color="danger" onClick={logout}>
                    Sair <ExitToApp />
                  </MenuItem>
                </Menu>
              </Dropdown>
            )}
            <Badge badgeContent={quantidadeCarrinho} color="primary">
              <IconButton
                variant="outlined"
                onClick={() => {
                  router.push("/carrinho");
                }}
              >
                <ShoppingCartIcon />
              </IconButton>
            </Badge>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 1,
            }}
          >
            <IconButton
              size="sm"
              variant="plain"
              sx={{ p: 1 }}
              onClick={() => setOpenMenu(true)}
            >
              <M size={24} color="#fff" />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => router.push("/inicio")}
            >
              <Typography level="h4" sx={{ fontWeight: 700 }}>
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
              <Typography level="h4" sx={{ fontWeight: 700 }}>
                IMPORTA
              </Typography>
            </Box>
            <Box sx={{ p: 1, cursor: "none" }}>
              <Person
                sx={{ width: 24, height: 24, color: "#fff", display: "none" }}
              />
            </Box>
          </Box>
          <Box sx={{ width: "100%", px: 1 }}>
            <BuscaProdutoHeader fullWidth size="md" />
          </Box>
        </Box>
      </Box>
      {openMenu && (
        <>
          <Box
            onClick={() => setOpenMenu(false)}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              bgcolor: "rgba(0,0,0,0.5)",
              zIndex: 39,
            }}
          />
          <Sheet
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "70%",
              height: "100vh",
              bgcolor: "rgba(10,10,10)",
              p: 2,
              zIndex: 40,
              boxShadow: "4px 0 12px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              animation: "slideIn 0.25s ease-out",
              "@keyframes slideIn": {
                from: { transform: "translateX(-100%)" },
                to: { transform: "translateX(0)" },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => router.push("/inicio")}
            >
              <Typography level="h4" sx={{ fontWeight: 700 }}>
                IMPORT
              </Typography>

              <Box
                component="img"
                src={"/identidades/logo-import.png"}
                alt={"Logo"}
                sx={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                }}
              />

              <Typography level="h4" sx={{ fontWeight: 700 }}>
                IMPORTA
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                variant="plain"
                size="lg"
                sx={{
                  justifyContent: "flex-start",
                  fontSize: "1rem",
                  color: "#fff",
                  py: 1.5,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
                onClick={() => {
                  setOpenMenu(false);
                  router.push("/");
                }}
              >
                Inicio
              </Button>
              {menu.map((item) => (
                <Button
                  key={item.path}
                  variant="plain"
                  size="lg"
                  sx={{
                    justifyContent: "flex-start",
                    fontSize: "1rem",
                    color: "#fff",
                    py: 1.5,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                  onClick={() => {
                    setOpenMenu(false);
                    router.push(item.path);
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              onClick={() => setOpenMenu(false)}
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              Fechar
            </Button>
          </Sheet>
        </>
      )}
      </Container>
    </Box>
  );
}
