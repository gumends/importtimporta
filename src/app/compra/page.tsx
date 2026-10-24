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
  Modal,
  ModalDialog,
  ModalClose,
  DialogContent,
  ModalDialogProps,
  FormControl,
  FormLabel,
  Select,
  Option,
} from "@mui/joy";
import {
  formatarDinheiro,
  mascaraDinheiro,
  removerMascaraDinheiro,
} from "@/utils/mascara_dinheiro";
import { ProdutoService } from "@/services/produto/produto.service";
import { Produto as p, ProdutosResponse } from "@/types/ProdutoNovo.type";
import ModalEditarProduto from "../components/ModalEdicaoProduto";
import { JwtPayload } from "@/types/JwtPayload.type";
import { decodeJwtSafe, isJwtFormat } from "@/utils/jwt";
import { isUuidProduto, resolverProdutoIdCatalogo } from "@/utils/produtoId";
import BotaoAdicionarCarrinho from "@/app/components/BotaoAdicionarCarrinho";
import { useRouter } from "next/navigation";

interface ResponseParcela {
  valorOriginal: number;
  valorSubtraido: number;
  valorAPagar: number;
  juros: number;
}

function mapProdutoApi(data: unknown): p {
  const raw = data as Record<string, unknown>;
  const info =
    raw.informacoesAdicionais ?? raw.informacoesProduto ?? null;
  const imagens = Array.isArray(raw.imagens) ? raw.imagens : [];

  return {
    ...(raw as p),
    informacoesAdicionais: info as p["informacoesAdicionais"],
    imagens: imagens as p["imagens"],
  };
}

export default function Produto() {
  const router = useRouter();
  const [produto, setProduto] = React.useState<p | null>(null);
  const [variant, setVariant] = React.useState<
    ModalDialogProps["variant"] | undefined
  >(undefined);
  const [valor, setValor] = React.useState("");
  const [parcelas, setParcelas] = React.useState<number>(1);
  const [valorParcela, setValorParcela] = React.useState<ResponseParcela>();
  const [imagemPrincipal, setImagemPrincipal] =
    React.useState("/placeholder.png");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [produtoEdit, setProdutoEdit] = React.useState<p | null>(null);
  const service = new ProdutoService();
  const [data, setData] = React.useState<ProdutosResponse | null>(null);
  const [page, setPage] = React.useState(1);
  const [admin, setAdmin] = React.useState(false);
  const fetchProdutos = async (pagina: number) => {
    try {
      const res = await service.getProdutos({ pagina });
      setData(res);
    } catch (err) {
      console.error("Erro ao carregar produtos", err);
    }
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const rawId = urlParams.get("produtoId");
    const catalogoId = resolverProdutoIdCatalogo(rawId);

    if (!catalogoId) {
      router.replace("/inicio");
      return;
    }

    if (rawId && rawId !== catalogoId && !isUuidProduto(rawId)) {
      router.replace(`/compra?produtoId=${catalogoId}`);
      return;
    }

    let cancelado = false;

    service
      .getProdutoPorId(catalogoId)
      .then((raw) => {
        if (cancelado) return;
        const prod = mapProdutoApi(raw);
        if (prod?.id && isUuidProduto(String(prod.id))) {
          setImagemPrincipal(
            prod.imagens?.[0]?.caminho ?? "/placeholder.png",
          );
          setProduto(prod);
        } else {
          router.replace("/inicio");
        }
      })
      .catch(() => {
        if (!cancelado) router.replace("/inicio");
      });

    const token = sessionStorage.getItem("auth_token");
    if (token && !isJwtFormat(token)) {
      sessionStorage.removeItem("auth_token");
    } else {
      const decoded = decodeJwtSafe<JwtPayload>(token);
      if (decoded?.role === "Admin") {
        setAdmin(true);
      }
    }

    return () => {
      cancelado = true;
    };
  }, [router]);

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

  const handleComprar = () => {
    const mensagem = `Olá, gostaria de comprar o produto: ${produto.nomeProduto}`;
    window.location.href = `https://wa.me/5511951663573?text=${encodeURIComponent(
      mensagem
    )}`;
  };

  const temDesconto =
    produto.desconto > 0 && produto.valorOriginal > (produto.valor ?? 0);
  const imagensLista = produto.imagens ?? [];

  return (
    <Box sx={{ bgcolor: "#0a0a0a", color: "#fff", width: "100%", pb: 6 }}>
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 3, md: 5 },
          px: { xs: 2.5, md: 3 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 4, md: 6, lg: 8 },
            alignItems: "start",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "1.5rem", md: "1.875rem" },
                fontWeight: 600,
                letterSpacing: "-0.02em",
                mb: 3,
              }}
            >
              {produto.nomeProduto}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: { xs: 280, md: 360 },
              }}
            >
              <Box
                component="img"
                src={imagemPrincipal}
                alt={produto.nomeProduto}
                sx={{
                  width: "100%",
                  maxWidth: 440,
                  maxHeight: { xs: "45vh", md: "50vh" },
                  objectFit: "contain",
                }}
              />
            </Box>

            {imagensLista.length > 1 && (
              <Stack direction="row" spacing={1.25} sx={{ mt: 2.5 }}>
                {imagensLista.map((imagem, index) => {
                  const ativa = imagem.caminho === imagemPrincipal;
                  return (
                    <Box
                      key={`${imagem.caminho}-${index}`}
                      component="button"
                      type="button"
                      aria-label={`Ver imagem ${index + 1}`}
                      onClick={() => setImagemPrincipal(imagem.caminho)}
                      sx={{
                        width: 56,
                        height: 56,
                        p: 0.5,
                        border: "none",
                        borderBottom: ativa
                          ? "2px solid #fff"
                          : "2px solid transparent",
                        bgcolor: "transparent",
                        cursor: "pointer",
                        opacity: ativa ? 1 : 0.55,
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      <Box
                        component="img"
                        src={imagem.caminho}
                        alt=""
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>

          <Stack spacing={2.5} sx={{ pt: { md: 5 } }}>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "1rem",
                lineHeight: 1.65,
              }}
            >
              {produto.descricao}
            </Typography>

            <Box>
              {temDesconto && (
                <Typography
                  sx={{
                    textDecoration: "line-through",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "1rem",
                  }}
                >
                  {formatarDinheiro(produto.valorOriginal)}
                </Typography>
              )}
              <Typography
                sx={{
                  fontSize: "1.75rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                {formatarDinheiro(produto.valor ?? 0)}
              </Typography>
              <Typography level="body-sm" sx={{ mt: 1, color: "rgba(255,255,255,0.5)" }}>
                PIX à vista · 7% de desconto
              </Typography>
              <Typography level="body-sm" sx={{ color: "rgba(255,255,255,0.45)" }}>
                ou 5x de{" "}
                {formatarDinheiro((produto.valorParcelado * 1.07) / 5)} sem juros
              </Typography>
            </Box>

            <Stack spacing={1.25} sx={{ maxWidth: 320 }}>
              <Button
                onClick={handleComprar}
                fullWidth
                sx={{
                  bgcolor: "#fff",
                  color: "#000",
                  fontWeight: 600,
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "#e8e8e8" },
                }}
              >
                Comprar agora
              </Button>
              {produto.id && (
                <BotaoAdicionarCarrinho
                  idProduto={produto.id}
                  sx={{ borderRadius: "8px" }}
                />
              )}
              {admin && (
                <Button
                  variant="plain"
                  fullWidth
                  sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem" }}
                  onClick={() => {
                    setProdutoEdit(produto);
                    setModalOpen(true);
                  }}
                >
                  Administrar produto
                </Button>
              )}
            </Stack>

            <Typography
              level="body-sm"
              sx={{
                color: produto.disponivel
                  ? "rgba(120, 200, 140, 0.9)"
                  : "rgba(255, 120, 120, 0.9)",
              }}
            >
              {produto.disponivel ? "Em estoque" : "Indisponível"}
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ my: 6, borderColor: "rgba(255,255,255,0.08)" }} />

        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            mb: 2.5,
          }}
        >
          Especificações
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1.5,
            color: "rgba(255,255,255,0.55)",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            maxWidth: 720,
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
          {produto.colorName && (
            <Typography>
              Cor · {produto.colorName}
            </Typography>
          )}
        </Box>
      </Container>
      <Modal open={!!variant} onClose={() => setVariant(undefined)}>
        <ModalDialog
          variant="outlined"
          sx={{ width: 600, display: "flex", flexDirection: "row" }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Box
              component="img"
              src={produto.imagens?.[0].caminho ?? "/placeholder.png"}
              alt={produto.nomeProduto}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                animation: "fadeIn 1s ease-in-out",
                "@keyframes fadeIn": {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
            />
            <Box
              sx={{ textAlign: "left", width: "100%", maxWidth: 260, mt: 2 }}
            >
              <Typography level="body-sm" sx={{ mb: 1 }}>
                <strong>Valor Original:</strong>{" "}
                {formatarDinheiro(valorParcela?.valorOriginal ?? 0)}
              </Typography>
              <Typography level="body-sm" sx={{ mb: 1 }}>
                <strong>Valor Subtraido:</strong>{" "}
                {formatarDinheiro(valorParcela?.valorSubtraido ?? 0)}
              </Typography>
              <Typography level="body-md" sx={{ mb: 1 }}>
                <strong>Valor:</strong>{" "}
                {formatarDinheiro(valorParcela?.valorAPagar ?? 0)}
              </Typography>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>
      <ModalEditarProduto
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        idProduto={produtoEdit?.id ?? ""}
        onSaved={() => fetchProdutos(page)}
      />
    </Box>
  );
}
