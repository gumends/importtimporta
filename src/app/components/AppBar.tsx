"use client";
import * as React from "react";
import {
  Box,
  Sheet,
  Button,
  Input,
  IconButton,
  Container,
  Typography,
} from "@mui/joy";
import { Search, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { buscaProdutosPorNome } from "@/services/produtos/produtos.service";
import { Produto } from "@/types/produto.type";
import { time } from "console";
import { Person, Person2 } from "@mui/icons-material";

export default function AppBar() {
  const router = useRouter();
  const [busca, setBusca] = React.useState("");
  const [pagina, setPagina] = React.useState("");
  const [produtos, setProdutos] = React.useState<Produto[]>([]);
  const [openMenu, setOpenMenu] = React.useState(false);

  const inputRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const menu = [
    { label: "Iphones", path: "/iphones" },
    { label: "Macs", path: "/macs" },
    { label: "Acessórios", path: "/acessorios" },
    { label: "Outros", path: "/outros" },
  ];

  function buscaProduto(nome: string) {
    if (!nome.trim()) {
      setProdutos([]);
      return;
    }

    buscaProdutosPorNome(nome).then((res: Produto[]) => {
      setProdutos(res || []);
    });
  }

  useEffect(() => {
    buscaProduto(busca);
  }, [busca]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setProdutos([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
              onClick={() => buscaProduto(busca)}
            >
              <Search size={18} color="#fff" />
            </IconButton>
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
              <Menu size={24} color="#fff" />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
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
            <IconButton
              size="sm"
              variant="plain"
              sx={{ p: 1 }}
              onClick={() => setOpenMenu(true)}
            >
              <Person sx={{ width: 24, height: 24, color: "#fff" }} />
            </IconButton>
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
              onClick={() => buscaProduto(busca)}
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
      {busca && produtos.length > 0 && (
        <Sheet
          ref={resultsRef}
          variant="soft"
          sx={{
            position: "absolute",
            top: { xs: "138px", md: "70px" },
            left: 0,
            right: 0,
            mx: "auto",
            width: { xs: "100%", sm: "90%", md: "50%" },
            bgcolor: "rgba(18,18,18,0.98)",
            borderRadius: "md",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            zIndex: 30,
            p: 1,
            maxHeight: 250,
            overflowY: "auto",
          }}
        >
          {produtos.map((p) => (
            <Box
              key={p.id}
              onClick={() => {
                router.push(`/compra?produtoId=${p.id}`);
                setBusca("");
                setProdutos([]);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1,
                borderRadius: "sm",
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <Box
                component="img"
                src={p.imagem}
                sx={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                  borderRadius: "sm",
                }}
              />
              <Typography>{p.nomeProduto}</Typography>
            </Box>
          ))}
        </Sheet>
      )}
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
