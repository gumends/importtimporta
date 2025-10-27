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
  Chip,
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
import { Produto as p } from "@/types/produto.type";
import { buscaProduto, getProdutosPorProdutoIdEModeloId } from "@/services/produtos/produtos.service";
import {
  formatarDinheiro,
  mascaraDinheiro,
  removerMascaraDinheiro,
} from "@/utils/mascara_dinheiro";

interface ResponseParcela {
  valorOriginal: number;
  valorSubtraido: number;
  valorAPagar: number;
  juros: number;
}

export default function Produto() {
  const [produto, setProduto] = React.useState<p | null>(null);
  const [modeloSelecionado, setModeloSelecionado] = React.useState<number>(0);
  const [variant, setVariant] = React.useState<
    ModalDialogProps["variant"] | undefined
  >(undefined);
  const [valor, setValor] = React.useState("");
  const [parcelas, setParcelas] = React.useState<number>(1);
  const [valorParcela, setValorParcela] = React.useState<ResponseParcela>();

  const porcentagemParcelas: number[] = [
    1.07, 1.07, 1.07, 1.07, 1.07, 1.075, 1.08, 1.09, 1.095, 1.1, 1.105, 1.115,
    1.125, 1.13, 1.14, 1.145, 1.15, 1.155,
  ];

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoParam = urlParams.get("produtoId");

    if (produtoParam) {
      const produtoId = parseInt(produtoParam, 10);

      buscaProduto(produtoId).then((prod) => {
        if (prod) {
          setProduto(prod);
        }
      });
    }
  }, []);

  React.useEffect(() => {
    valorTotalSimulacao();
  }, [valor, parcelas]);

  function valorTotalSimulacao(valorNumerico?: number) {
    const valorOriginal = produto?.valorParcelado ?? 0;
    const valorPago = valorNumerico ?? removerMascaraDinheiro(valor.toString());

    const valorSubtraido = Math.max(valorOriginal - valorPago, 0);
    const juros = ((porcentagemParcelas[parcelas - 1] - 1) * 100).toFixed(1);
    const valorAPagar = valorSubtraido * porcentagemParcelas[parcelas - 1];

    setValorParcela({
      valorOriginal,
      valorSubtraido,
      valorAPagar,
      juros: Number(juros),
    });
  }

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
              produto.imagem ?? "/placeholder.png"
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
              fontSize: "1.2rem",
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
                fontSize: "1.5rem",
              }}
            >
              {precoOriginal}
            </Typography>
          )}
          <Typography
            sx={{
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "#fff",
              textAlign: "left",
            }}
          >
            {preco}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.9rem",
              color: "#fff",
              mb: 1,
              textAlign: "left",
            }}
          >
            À vista no PIX com{" "}
            <b>
              {((porcentagemParcelas[4] - 1) * 100).toFixed(0)}% de desconto
            </b>
          </Typography>
          <Typography sx={{ mb: 4, color: "#ccc", textAlign: "left" }}>
            {formatarDinheiro(produto.valorParcelado * porcentagemParcelas[4])}{" "}
            em até <b>5x</b> de{" "}
            {formatarDinheiro(
              (produto.valorParcelado * porcentagemParcelas[4]) / 5
            )}{" "}
            sem juros
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
              onClick={() => {
                setVariant("soft");
                valorTotalSimulacao();
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
              src={
                produto.imagem ??
                "/placeholder.png"
              }
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
          <Box>
            <ModalClose />
            <Typography level="h4" sx={{ mb: 2, textAlign: "center", mt: 2 }}>
              Simulação de Pagamento
            </Typography>

            <DialogContent>
              <Typography level="body-md" sx={{ mb: 2, textAlign: "center" }}>
                Digite o valor a vista e selecione o número de parcelas.
              </Typography>

              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Valor à vista (R$)</FormLabel>
                <Input
                  type="text"
                  value={valor}
                  onChange={(e) => {
                    const valorFormatado = mascaraDinheiro(e.target.value);
                    setValor(valorFormatado);

                    // calcula novamente com o valor numérico
                    const valorNumerico =
                      removerMascaraDinheiro(valorFormatado);
                    valorTotalSimulacao(valorNumerico);
                  }}
                  placeholder="Ex: R$ 1.500,00"
                />
              </FormControl>

              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Parcelas no cartão</FormLabel>
                <Select<number>
                  value={parcelas}
                  onChange={(_, val) => {
                    setParcelas(val || 1);
                    valorTotalSimulacao();
                  }}
                  defaultValue={1}
                  sx={{
                    width: "100%",
                    ".MuiSelect-button": {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    },
                  }}
                  renderValue={(option) => {
                    const selected = option?.value ?? 1;
                    const juros = (
                      (porcentagemParcelas[selected - 1] - 1) *
                      100
                    ).toFixed(1);
                    const jurosFormatado =
                      juros.split(".")[1] != "0"
                        ? juros
                        : Math.round(parseFloat(juros));
                    return (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography component="span">{selected}x</Typography>
                        {selected >= 6 ? (
                          <Chip
                            color="success"
                            size="sm"
                            variant="soft"
                            sx={{
                              fontSize: "11px",
                              height: 20,
                              px: 0.5,
                            }}
                          >
                            Juros: {juros}%
                          </Chip>
                        ) : (
                          <Chip
                            color="success"
                            size="sm"
                            variant="soft"
                            sx={{
                              fontSize: "11px",
                              height: 20,
                              px: 0.5,
                            }}
                          >
                            Sem Juros
                          </Chip>
                        )}
                      </Box>
                    );
                  }}
                >
                  {[...Array(18)].map((_, i) => (
                    <Option
                      key={i + 1}
                      value={i + 1}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        py: 0.5,
                      }}
                    >
                      <Typography component="span">{i + 1}x</Typography>
                      {i >= 5 ? (
                        <Chip
                          color="success"
                          size="sm"
                          variant="soft"
                          sx={{
                            fontSize: "10px",
                            height: 18,
                            px: 0.5,
                          }}
                        >
                          Juros:{" "}
                          {((porcentagemParcelas[i] - 1) * 100)
                            .toFixed(1)
                            .split(".")[1] != "0"
                            ? ((porcentagemParcelas[i] - 1) * 100).toFixed(1)
                            : Math.round(
                                parseFloat(
                                  ((porcentagemParcelas[i] - 1) * 100).toFixed(
                                    1
                                  )
                                )
                              )}
                          %
                        </Chip>
                      ) : (
                        <Chip
                          color="success"
                          size="sm"
                          variant="soft"
                          sx={{
                            fontSize: "10px",
                            height: 18,
                            px: 0.5,
                          }}
                        >
                          Sem juros
                        </Chip>
                      )}
                    </Option>
                  ))}
                </Select>
              </FormControl>

              <Button
                sx={{
                  mt: 1,
                  bgcolor: "#fff",
                  color: "#000",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#f5f5f5" },
                  textTransform: "none",
                }}
                fullWidth
              >
                COMPRAR AGORA
              </Button>
            </DialogContent>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
