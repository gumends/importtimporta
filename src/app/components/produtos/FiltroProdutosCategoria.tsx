"use client";

import React from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";

export interface FiltroProdutosCategoriaProps {
  nomeProduto: string;
  precoMinimo?: number;
  precoMaximo?: number;
  onNomeChange: (valor: string) => void;
  onPrecoMinChange: (valor: number | undefined) => void;
  onPrecoMaxChange: (valor: number | undefined) => void;
  onAplicar: () => void;
  onLimpar: () => void;
  loading?: boolean;
}

export default function FiltroProdutosCategoria({
  nomeProduto,
  precoMinimo,
  precoMaximo,
  onNomeChange,
  onPrecoMinChange,
  onPrecoMaxChange,
  onAplicar,
  onLimpar,
  loading = false,
}: FiltroProdutosCategoriaProps) {
  const temFiltroAtivo =
    nomeProduto.trim() !== "" ||
    precoMinimo !== undefined ||
    precoMaximo !== undefined;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onAplicar();
  };

  return (
    <Sheet
      variant="outlined"
      sx={{
        width: "100%",
        p: 2,
        borderRadius: "xl",
        bgcolor: "rgba(18, 18, 18, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.12)",
        position: "sticky",
        top: { xs: 72, md: 88 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <TuneIcon sx={{ fontSize: 20, opacity: 0.85 }} />
        <Typography level="title-md" sx={{ fontWeight: 600 }}>
          Filtrar produtos
        </Typography>
      </Stack>

      <Stack spacing={2}>
        <FormControl>
          <FormLabel>Nome do produto</FormLabel>
          <Input
            placeholder="Ex.: iPhone 16 Pro"
            variant="soft"
            value={nomeProduto}
            onChange={(e) => onNomeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            startDecorator={<SearchIcon sx={{ opacity: 0.6 }} />}
            slotProps={{ input: { "aria-label": "Buscar por nome" } }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Preço mínimo</FormLabel>
          <Input
            type="number"
            placeholder="0"
            variant="soft"
            value={precoMinimo ?? ""}
            onChange={(e) =>
              onPrecoMinChange(
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            onKeyDown={handleKeyDown}
            startDecorator={
              <Typography level="body-xs" sx={{ opacity: 0.65 }}>
                R$
              </Typography>
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>Preço máximo</FormLabel>
          <Input
            type="number"
            placeholder="Sem limite"
            variant="soft"
            value={precoMaximo ?? ""}
            onChange={(e) =>
              onPrecoMaxChange(
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            onKeyDown={handleKeyDown}
            startDecorator={
              <Typography level="body-xs" sx={{ opacity: 0.65 }}>
                R$
              </Typography>
            }
          />
        </FormControl>

        <Stack spacing={1}>
          <Button
            fullWidth
            variant="solid"
            disabled={loading}
            onClick={onAplicar}
            startDecorator={<FilterListIcon />}
            sx={{
              bgcolor: "#fff",
              color: "#000",
              fontWeight: 700,
              "&:hover": { bgcolor: "#f0f0f0" },
            }}
          >
            Buscar
          </Button>
          <Button
            fullWidth
            variant="soft"
            color="neutral"
            disabled={!temFiltroAtivo || loading}
            onClick={onLimpar}
          >
            Limpar
          </Button>
        </Stack>
      </Stack>
    </Sheet>
  );
}
