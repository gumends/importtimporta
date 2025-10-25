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

export default function AppBar() {
  const router = useRouter();
  const [busca, setBusca] = React.useState("");
  const [openMenu, setOpenMenu] = React.useState(false);
  const [pagina, setPagina] = React.useState("");
  const [produtos, setProdutos] = React.useState<Produto[]>([]);

  // referências para detectar clique fora
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

  // debounce (espera o usuário parar de digitar)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      buscaProduto(busca);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [busca]);

  // fecha a caixa ao clicar fora
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
      }}
    >
      {/* Barra principal */}
      <Sheet
        variant="soft"
        sx={{
          borderRadius: "xl",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          backdropFilter: "blur(20px)",
          background: "rgba(15, 15, 15, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 1,
            pl: 1,
          }}
        >
          <Box
            onClick={() => router.push("/inicio")}
            component="img"
            src="/logo-import.png"
            alt="Import Importa"
            sx={{
              width: "5%",
              maxWidth: 1200,
              height: "auto",
              objectFit: "contain",
              cursor: "pointer",
              mr: 1,
            }}
          />
          {menu.map((item, index) => (
            <Button
              key={index}
              onClick={() => {
                window.location.href = item.path;
              }}
              variant={pagina === item.path ? "solid" : "plain"}
              size="sm"
              sx={{
                borderRadius: "sm",
                fontWeight: 500,
                backgroundColor:
                  pagina === item.path
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.12)",
                },
                color: pagina === item.path ? "#fff" : "rgba(255,255,255,0.7)",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Campo de busca */}
        <Box
          ref={inputRef}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: { xs: "100%", sm: "auto" },
            justifyContent: "flex-end",
            flexGrow: 1,
            position: "relative",
          }}
        >
          <Input
            placeholder="Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onClick={() => {
              buscaProduto(busca);
            }}
            size="sm"
            variant="soft"
            sx={{
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
              borderRadius: "md",
              width: { xs: "100%", sm: "80%" },
              "& input::placeholder": { color: "rgba(255,255,255,0.5)" },
            }}
          />
          <IconButton
            size="sm"
            variant="soft"
            color="neutral"
            sx={{
              bgcolor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
            }}
            onClick={() => {
              buscaProduto(busca);
            }}
          >
            <Search size={18} color="#fff" />
          </IconButton>

          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            sx={{
              display: { xs: "flex", md: "none" },
              ml: 1,
            }}
            onClick={() => {
              setOpenMenu((prev) => !prev);
            }}
          >
            <Menu size={20} color="#fff" />
          </IconButton>

          {/* Resultados da busca */}
          {busca && produtos.length > 0 && (
            <Sheet
              ref={resultsRef}
              variant="soft"
              sx={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 40,
                width: { xs: "100%", sm: "80%" },
                bgcolor: "rgba(18,18,18,0.98)",
                borderRadius: "md",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                zIndex: 30,
                p: 0.5,
                maxHeight: 200,
                overflowY: "auto",
                border: "1px solid rgba(255,255,255,0.08)",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(255,255,255,0.25)",
                  borderRadius: "8px",
                  border: "2px solid transparent",
                  backgroundClip: "content-box",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "rgba(255,255,255,0.4)",
                },
              }}
            >
              {produtos.map((p) => (
                <Box
                  key={p.id}
                  onClick={() => {
                    router.push(
                      `/compra?produtoId=${p.id}&modeloId=${p.modelos?.[0]?.id}`
                    );
                    setBusca("");
                    setProdutos([]);
                    setTimeout(() => {
                      window.location.reload();
                    }, 300);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 0.8,
                    mb: 0.6,
                    borderRadius: "sm",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    bgcolor: "rgba(255,255,255,0.03)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  <Box
                    component="img"
                    src={p.modelos?.[0]?.image || "/placeholder.png"}
                    alt={p.nomeProduto}
                    sx={{
                      width: 40,
                      height: 40,
                      objectFit: "contain",
                      borderRadius: "sm",
                      backgroundColor: "rgba(0,0,0,0.3)",
                    }}
                  />
                  <Typography
                    level="body-sm"
                    sx={{
                      color: "#fff",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                    }}
                  >
                    {p.nomeProduto}
                  </Typography>
                </Box>
              ))}
            </Sheet>
          )}
        </Box>
      </Sheet>
    </Container>
  );
}
