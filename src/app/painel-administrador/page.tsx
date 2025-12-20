"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Link,
  AspectRatio,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { Person, Shop } from "@mui/icons-material";

export default function ProdutosLista() {

  const rotas = [
    {
      nome: "Usuarios",
      subText: "Gerenciar Usuarios",
      link: "/painel-administrador/usuarios",
      icone: <Person sx={{ width: "100%", height: "100%" }} />,
    },
    {
      nome: "Produtos",
      subText: "Gerenciar Produtos",
      link: "/painel-administrador/produtos",
      icone: <Shop sx={{ width: "100%", height: "100%" }} />,
    },
  ];

  return (
    <Box
      sx={{
        color: "#fff",
        minHeight: "100vh",
        py: 6,
        px: { xs: 2, md: 6 },
      }}
    >
      <Typography
        level="h2"
        sx={{
          fontWeight: 600,
          textAlign: "center",
          mb: 4,
          color: "#fff",
        }}
      >
        Painel Administrador
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 5,
          justifyContent: "center",
        }}
      >
        {rotas.map((rota) => (
          <Card
            key={rota.nome}
            variant="outlined"
            orientation="horizontal"
            sx={{
              width: 320,
              "&:hover": {
                boxShadow: "md",
                borderColor: "neutral.outlinedHoverBorder",
              },
            }}
          >
            <Box sx={{ width: 90, bgcolor: "transparent" }}>{rota.icone}</Box>
            <CardContent>
              <Typography level="title-lg" id="card-description">
                {rota.nome}
              </Typography>
              <Typography
                level="body-sm"
                aria-describedby="card-description"
                sx={{ mb: 1 }}
              >
                <Link
                  overlay
                  underline="none"
                  href={rota.link}
                  sx={{ color: "text.tertiary" }}
                >
                  {rota.subText}
                </Link>
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
