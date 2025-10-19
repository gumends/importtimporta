"use client";
import * as React from "react";
import { Box, Sheet, Button, Input, IconButton, Container } from "@mui/joy";
import { Search, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppBar() {
  const router = useRouter();
  const [busca, setBusca] = React.useState("");
  const [openMenu, setOpenMenu] = React.useState(false);
  const [pagina, setPagina] = React.useState("");

  const menu = [
    { label: "Iphones", path: "/iphones" },
    { label: "Relogios", path: "/relogios" },
    { label: "Acessórios", path: "/acessorios" },
    { label: "Outros", path: "/outros" },
  ];
  
  useEffect(() => {
    setPagina(window.location.pathname);
    if (typeof (window as any).loading === "function") {
      (window as any).loading();
    }
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        position: "relative",
        mt: 2,
      }}
    >
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
            alt="Produto destaque"
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
              onClick={() => {window.location.href = item.path;}}
              variant={pagina === item.path ? "solid" : "plain"}
              size="sm"
              sx={{
                borderRadius: "sm",
                fontWeight: 500,
                backgroundColor:
                  pagina === item.path ? "rgba(255,255,255,0.08)" : "transparent",
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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: { xs: "100%", sm: "auto" },
            justifyContent: "flex-end",
            flexGrow: 1,
          }}
        >
          <Input
            placeholder="Busca"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            size="sm"
            variant="soft"
            sx={{
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
              borderRadius: "md",
              width: { xs: "100%", sm: 300 },
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
            onClick={() => setOpenMenu((prev) => !prev)}
          >
            <Menu size={20} color="#fff" />
          </IconButton>
        </Box>
      </Sheet>

      {openMenu && (
        <Sheet
          variant="soft"
          sx={{
            mt: 1,
            borderRadius: "md",
            p: 1,
            backdropFilter: "blur(20px)",
            background: "rgba(15,15,15,0.9)",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {menu.map((item) => (
            <Button
              key={item.path}
              variant="soft"
              color="neutral"
              onClick={() => {
                router.push(item.path);
                setOpenMenu(false);
              }}
              sx={{
                borderRadius: "sm",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Sheet>
      )}
    </Container>
  );
}
