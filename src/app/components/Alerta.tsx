"use client";

import React from "react";
import Snackbar from "@mui/joy/Snackbar";

interface Props {
  mensagem: string;
  tipo?: "success" | "danger" | "warning" | "primary" | "neutral";
  aberto: boolean;
  aoFechar: () => void;
}

export default function Alerta({ mensagem, tipo = "neutral", aberto, aoFechar }: Props) {
  return (
    <Snackbar
      autoHideDuration={3000}
      open={aberto}
      color={tipo}
      variant="soft"
      onClose={() => aoFechar()}
    >
      {mensagem}
    </Snackbar>
  );
}
