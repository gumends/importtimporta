"use client";

import React, { useState } from "react";
import { Button } from "@mui/joy";
import { AddShoppingCart, Check } from "@mui/icons-material";
import { CarrinhoService } from "@/services/carrinho/carrinho.service";

type Estado = "idle" | "loading" | "added" | "error";

interface Props {
  idProduto: string;
  quantidade?: number;
  fullWidth?: boolean;
  /** Apenas ícone (ex.: carrossel da home) */
  compact?: boolean;
  sx?: Record<string, unknown>;
}

export default function BotaoAdicionarCarrinho({
  idProduto,
  quantidade = 1,
  fullWidth = true,
  compact = false,
  sx,
}: Props) {
  const [estado, setEstado] = useState<Estado>("idle");
  const service = new CarrinhoService();

  const handleClick = async () => {
    if (estado === "loading") return;
    setEstado("loading");
    try {
      await service.adicionarAoCarrinho(idProduto, quantidade);
      setEstado("added");
      window.setTimeout(() => setEstado("idle"), 1600);
    } catch {
      setEstado("error");
      window.setTimeout(() => setEstado("idle"), 2500);
    }
  };

  const label =
    estado === "loading"
      ? "Adicionando..."
      : estado === "added"
        ? "Adicionado!"
        : estado === "error"
          ? "Não foi possível adicionar"
          : "Adicionar ao carrinho";

  const startDecorator =
    estado === "added" ? (
      <Check fontSize="small" />
    ) : estado === "idle" ? (
      <AddShoppingCart fontSize="small" />
    ) : undefined;

  if (compact) {
    const Icon = estado === "added" ? Check : AddShoppingCart;
    return (
      <Button
        color={estado === "error" ? "danger" : "primary"}
        variant="solid"
        onClick={handleClick}
        disabled={estado === "loading"}
        aria-label={label}
        sx={{ minWidth: 44, minHeight: 44, ...sx }}
      >
        <Icon fontSize="small" />
      </Button>
    );
  }

  return (
    <Button
      fullWidth={fullWidth}
      color={estado === "error" ? "danger" : "primary"}
      variant="solid"
      onClick={handleClick}
      disabled={estado === "loading"}
      startDecorator={startDecorator}
      sx={{ minHeight: 44, fontWeight: 600, ...sx }}
    >
      {label}
    </Button>
  );
}
