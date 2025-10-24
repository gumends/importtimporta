"use client";

import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Divider,
  Input,
  Card,
  Chip,
} from "@mui/joy";
import { Produto as p } from "@/types/produto.type";
import { getProdutosPorProdutoIdEModeloId } from "@/services/produtos/produtos.service";
import { formatarDinheiro } from "@/utils/mascara_dinheiro";

export default function Produto() {
  const [produto, setProduto] = React.useState<p | null>(null);
  const [modeloSelecionado, setModeloSelecionado] = React.useState<number>(0);
  const [cep, setCep] = React.useState("");

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoParam = urlParams.get("produtoId");
    const modeloParam = urlParams.get("modeloId");

    if (produtoParam && modeloParam) {
      const produtoId = parseInt(produtoParam, 10);
      const modeloId = parseInt(modeloParam, 10);

      getProdutosPorProdutoIdEModeloId(produtoId, modeloId).then((prod) => {
        if (prod) setProduto(prod);
      });
    }
  }, []);

  if (!produto) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#0a0a0a",
          color: "#fff",
        }}
      >
        <Typography level="body-lg">Carregando produto...</Typography>
      </Box>
    );
  }

  const preco = produto.valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const precoOriginal = produto.valorOriginal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const handleComprar = () => {
    const mensagem = `Olá, gostaria de comprar o produto: ${produto.nomeProduto}`;
    window.location.href = `https://wa.me/5511951663573?text=${encodeURIComponent(
      mensagem
    )}`;
  };

  return (
    <Box
      sx={{
        bgcolor: "#0a0a0a",
        color: "#fff",
        width: "100%",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          px: 4,
          gap: 4,
          mt: 10,
        }}
      >
        {/* Lado esquerdo — imagem */}
        <Box
          sx={{
            flex: 1,
            height: "100%",
          }}
        >
          <Typography
            sx={{
              mb: 2,
              fontSize: { xs: "1.3rem", md: "2.2rem" },
              color: "#fff",
            }}
          >
            {produto.nomeProduto}
          </Typography>
          <Box
            component="img"
            src={
              produto.modelos?.[modeloSelecionado]?.image ?? "/placeholder.png"
            }
            alt={produto.nomeProduto}
            sx={{
              width: "100%",
              objectFit: "contain",
              animation: "fadeIn 1s ease-in-out",
              "@keyframes fadeIn": {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            }}
          />
        </Box>

        {/* Lado direito — informações */}
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Typography
            sx={{
              textAlign: "justify",
              color: "#aaa",
              fontSize: "1rem",
              lineHeight: 1.8,
              maxWidth: 900,
              mx: "auto",
            }}
          >
            {produto.descricao}
          </Typography>
          {produto.desconto > 0 && (
            <Typography
              sx={{
                textAlign: "left",
                textDecoration: "line-through",
                color: "#777",
                fontSize: "13px",
              }}
            >
              {precoOriginal}
            </Typography>
          )}
          <Typography
            sx={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#fff",
              mb: 1,
              textAlign: "left",
            }}
          >
            {preco}
          </Typography>

          <Typography sx={{ mb: 4, color: "#ccc", textAlign: "left" }}>
            ou em até <b>10x</b> sem juros de{" "}
            {formatarDinheiro(produto.valorParcelado)}
          </Typography>

          {/* Botões */}
          <Stack spacing={2} sx={{ mb: 4 }}>
            <Button
              onClick={handleComprar}
              sx={{
                bgcolor: "#fff",
                color: "#000",
                fontWeight: 700,
                "&:hover": { bgcolor: "#f5f5f5" },
                textTransform: "none",
              }}
            >
              COMPRAR AGORA
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#fff",
                color: "#fff",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              SIMULAR PAGAMENTO
            </Button>
          </Stack>
          <Chip color={produto.disponivel ? "success" : "danger"}>
            {produto.disponivel ? "Produto Disponivel" : "Produto Indisponivel"}
          </Chip>
        </Box>
      </Container>
      <Container>
        <Divider sx={{ mt: 7, mb: 5, bgcolor: "rgba(255,255,255,0.12)" }} />

        <Typography
          sx={{
            textAlign: "center",
            color: "#fff",
            fontSize: "1.8rem",
            fontWeight: 700,
            mb: 3,
          }}
        >
          Descrição do produto
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
            color: "#ccc",
            fontSize: "1rem",
            lineHeight: 1.8,
            mb: 8,
          }}
        >
          {produto.informacoesAdicionais?.marca && (
            <Typography>
              Marca: <b>{produto.informacoesAdicionais.marca}</b>
            </Typography>
          )}
          {produto.informacoesAdicionais?.armazenamentoInterno && (
            <Typography>
              Armazenamento Interno:{" "}
              <b>{produto.informacoesAdicionais.armazenamentoInterno}</b>
            </Typography>
          )}
          {produto.informacoesAdicionais?.tipoTela && (
            <Typography>
              Tipo de Tela: <b>{produto.informacoesAdicionais.tipoTela}</b>
            </Typography>
          )}
          {produto.informacoesAdicionais?.tamanhoTela && (
            <Typography>
              Tamanho da Tela:{" "}
              <b>{produto.informacoesAdicionais.tamanhoTela}</b>
            </Typography>
          )}
          {produto.informacoesAdicionais?.resolucaoTela && (
            <Typography>
              Resolução da Tela:{" "}
              <b>{produto.informacoesAdicionais.resolucaoTela}</b>
            </Typography>
          )}
          {produto.informacoesAdicionais?.tecnologia && (
            <Typography>
              Tecnologia: <b>{produto.informacoesAdicionais.tecnologia}</b>
            </Typography>
          )}
          {produto.informacoesAdicionais?.processador && (
            <Typography>
              Processador: <b>{produto.informacoesAdicionais.processador}</b>
            </Typography>
          )}
          {produto.informacoesAdicionais?.sistemaOperacional && (
            <Typography>
              Sistema Operacional:{" "}
              <b>{produto.informacoesAdicionais.sistemaOperacional}</b>
            </Typography>
          )}
          {produto.informacoesAdicionais?.cameraTraseira && (
            <Typography>
              Câmera Traseira:{" "}
              <b>{produto.informacoesAdicionais.cameraTraseira}</b>
            </Typography>
          )}
          {produto.informacoesAdicionais?.cameraFrontal && (
            <Typography>
              Câmera Frontal:{" "}
              <b>{produto.informacoesAdicionais.cameraFrontal}</b>
            </Typography>
          )}
          {produto.informacoesAdicionais?.bateria && (
            <Typography>
              Bateria: <b>{produto.informacoesAdicionais.bateria}</b>
            </Typography>
          )}
          {produto.informacoesAdicionais?.quantidadeChips && (
            <Typography>
              Quantidade de Chips:{" "}
              <b>{produto.informacoesAdicionais.quantidadeChips}</b>
            </Typography>
          )}
          {produto.informacoesAdicionais?.material && (
            <Typography>
              Material: <b>{produto.informacoesAdicionais.material}</b>
            </Typography>
          )}
          <Typography>
            Garantia: <b>{produto.mesesGarantia} meses</b>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
