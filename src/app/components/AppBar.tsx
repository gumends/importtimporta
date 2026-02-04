"use client";
import * as React from "react";
import {
  Box,
  Sheet,
  Button,
  Input,
  Container,
  Typography,
  Badge,
} from "@mui/joy";
import { Search, Menu as M } from "lucide-react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ExitToApp, Person } from "@mui/icons-material";
import LoginComponent from "./LoginComponent";
import { GoogleAuthService } from "@/services/auth/auth.service";
import { MenuResponse } from "@/types/menus.type";
import { UserService } from "@/services/user/user.service";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import MenuButton from "@mui/joy/MenuButton";
import IconButton from "@mui/joy/IconButton";
import { CarrinhoService } from "@/services/carrinho/carrinho.service";

export default function AppBar() {
  const router = useRouter();
  const [busca, setBusca] = React.useState("");
  const [pagina, setPagina] = React.useState("");
  const [openMenu, setOpenMenu] = React.useState(false);
  const [logado, setLogado] = React.useState(false);
  const [menus, setMenus] = React.useState<MenuResponse>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [quantidadeCarrinho, setQuantidadeCarrinho] = React.useState<number>(0);

  const googleAuth = new GoogleAuthService();
  const userService = new UserService();

  const inputRef = useRef<HTMLDivElement | null>(null);
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
    const response: MenuResponse = await userService.GetMenus(email);
    setMenus(response);
  }

  const sincronizarCarrinhoLocal = async (token: string) => {
    const carrinhoStorage = sessionStorage.getItem("carrinho");

    if (!carrinhoStorage) return;

    const carrinhoLocal = JSON.parse(carrinhoStorage);

    if (!carrinhoLocal?.carrinhos?.length) return;

    for (const item of carrinhoLocal.carrinhos) {
      await serviceCarrihno.postCarrinho(
        {
          IdProduto: item.IdProduto,
          Quantidade: item.quantidade,
        },
        token,
      );
    }

    sessionStorage.removeItem("carrinho");
  };

  useEffect(() => {
    const init = async () => {
      const res = await googleAuth.me();

      if (!res || !res.email) return;

      getMenus(res.email);
      setLogado(true);

      const token = sessionStorage.getItem("auth_token");
      if (!token) return;

      await sincronizarCarrinhoLocal(token);

      const carrinhoApi = await serviceCarrihno.getCarrinho();
      setQuantidadeCarrinho(carrinhoApi.carrinhos.length);
    };

    init();
  }, []);

  useEffect(() => {
    setPagina(window.location.pathname);
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        position: "relative",
        mt: 2,
        pb: { xs: 2, md: 0 },
      }}
    >
      <Sheet
        variant="soft"
        sx={{
          borderRadius: "xl",
          p: 1.5,
          backdropFilter: "blur(20px)",
          background: "rgba(15, 15, 15, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
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
            ref={inputRef}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              position: "relative",
            }}
          >
            <Input
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              size="sm"
              variant="soft"
              sx={{
                width: 450,
                bgcolor: "rgba(0,0,0,0.5)",
                color: "#fff",
                borderRadius: "md",
                "& input::placeholder": { color: "rgba(255,255,255,0.5)" },
              }}
            />
            <IconButton
              size="sm"
              variant="soft"
              sx={{
                bgcolor: "rgba(255,255,255,0.08)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
              }}
            >
              <Search size={18} color="#fff" />
            </IconButton>
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
          <Box
            ref={inputRef}
            sx={{
              width: "100%",
              px: 1,
              display: "flex",
              gap: 1,
              position: "relative",
            }}
          >
            <Input
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              variant="soft"
              size="md"
              sx={{
                flexGrow: 1,
                bgcolor: "rgba(0,0,0,0.5)",
                color: "#fff",
                borderRadius: "md",
                "& input::placeholder": {
                  color: "rgba(255,255,255,0.5)",
                },
              }}
            />

            <IconButton
              size="md"
              variant="soft"
              sx={{
                bgcolor: "rgba(255,255,255,0.08)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              <Search size={20} color="#fff" />
            </IconButton>
          </Box>
        </Box>
      </Sheet>
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
  );
}
