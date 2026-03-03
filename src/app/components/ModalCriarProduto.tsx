"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalDialog,
  Typography,
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Grid,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Select,
  Option,
  SvgIcon,
  Container,
} from "@mui/joy";
import { styled } from "@mui/joy";
import Alerta from "./Alerta";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProdutoService } from "@/services/produto/produto.service";
import { Produto } from "@/types/produto.type";
interface PropsCriarProduto {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

type TipoAlerta = "success" | "danger" | "warning" | "primary" | "neutral";

export default function ModalCriarProduto({
  open,
  onClose,
  onSaved,
}: PropsCriarProduto) {
  const [aba, setAba] = useState(0);
  const produtoService = new ProdutoService();

  const EntradaOculta = styled("input")`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;

  const CaixaImagem = styled("div")({
    position: "relative",
    width: "120px",
    height: "120px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #444",
    cursor: "pointer",
  });

  const SobreposicaoHover = styled("div")({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s",
    "&:hover": {
      opacity: 1,
    },
  });

  const formularioVazio = {
    nomeProduto: "",
    valorOriginal: "",
    valorParcelado: "",
    desconto: "",
    descricao: "",
    tipoProduto: 0,
    disponivel: true,
    mesesGarantia: "",
    quantidade: "",
    informacoesProduto: {
      marca: "",
      armazenamentoInterno: "",
      tipoTela: "",
      tamanhoTela: "",
      resolucaoTela: "",
      tecnologia: "",
      processador: "",
      sistemaOperacional: "",
      cameraTraseira: "",
      cameraFrontal: "",
      bateria: "",
      quantidadeChips: "",
      material: "",
    },
    color: "",
    colorName: "",
  };

  const [formulario, setFormulario] =
    useState<FormularioProduto>(formularioVazio);

  const [imagensUpload, setImagensUpload] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    if (open) {
      setFormulario(formularioVazio);
      setImagensUpload([]);
      setAba(0);

      const tokenCookie = sessionStorage.getItem("auth_token");

      setToken(tokenCookie || "");
    }
  }, [open]);

  const alterar = <K extends keyof FormularioProduto>(
    campo: K,
    valor: FormularioProduto[K]
  ) => {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const alterarInfo = <K extends keyof InformacoesAdicionais>(
    campo: K,
    valor: InformacoesAdicionais[K]
  ) => {
    setFormulario((anterior) => ({
      ...anterior,
      informacoesAdicionais: {
        ...anterior.informacoesProduto,
        [campo]: valor,
      },
    }));
  };

  const [alertaAberto, setAlertaAberto] = useState(false);
  const [alertaMensagem, setAlertaMensagem] = useState("");
  const [alertaTipo, setAlertaTipo] = useState<
    "success" | "danger" | "warning" | "primary" | "neutral"
  >("neutral");

  const mostrarAlerta = (msg: string, tipo: TipoAlerta) => {
    setAlertaMensagem(msg);
    setAlertaTipo(tipo);
    setAlertaAberto(true);
  };

  const removerImagemUpload = (i: number) => {
    setImagensUpload((anterior) => anterior.filter((_, idx) => idx !== i));
  };

  const validarFormulario = () => {
    const camposObrigatorios: (keyof FormularioProduto)[] = [
      "nomeProduto",
      "valorOriginal",
      "valorParcelado",
      "desconto",
      "descricao",
      "tipoProduto",
      "mesesGarantia",
      "color",
      "colorName",
    ];

    for (const campo of camposObrigatorios) {
      if (!formulario[campo] || formulario[campo].toString().trim() === "")
        return false;
    }

    if (imagensUpload.length === 0) return false;

    return true;
  };

  const salvar = async () => {
    if (!validarFormulario()) {
      mostrarAlerta("Preencha todos os campos obrigatórios e envie ao menos uma imagem.", "warning");
      return;
    }

    setIsLoading(true);

    produtoService.postProduto(formulario, token).then((response) => {
      produtoService.salvarImagens(response.id, imagensUpload).then(() => {
        mostrarAlerta("Produto criado com sucesso!", "success");
        onSaved();
        onClose();
      }).catch(() => {
        mostrarAlerta("Produto criado, mas houve um erro ao salvar as imagens.", "warning");
        onSaved();
        onClose();
      }).finally(() => {
        setIsLoading(false);
      });
    }).catch(() => {
      mostrarAlerta("Erro ao criar produto. Verifique os dados e tente novamente.", "danger");
    })
  };

  return (
    <Container>
      <Modal open={open} onClose={onClose}>
        <ModalDialog
          sx={{
            width: 900,
            maxHeight: "90vh",
            overflowY: "auto",
            background: "#111",
          }}
        >
          <Typography level="h4" sx={{ mb: 2 }}>
            Novo Produto
          </Typography>

          <Tabs
            value={aba}
            onChange={(_, v) => setAba(Number(v))}
            sx={{ background: "#111" }}
          >
            <TabList>
              <Tab>Produto</Tab>
              <Tab>Informações Adicionais</Tab>
            </TabList>

            <TabPanel value={0}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid xs={12}>
                  <FormControl>
                    <FormLabel>Nome do Produto *</FormLabel>
                    <Input
                      value={formulario.nomeProduto}
                      onChange={(e) => alterar("nomeProduto", e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={4}>
                  <FormControl>
                    <FormLabel>Valor Original *</FormLabel>
                    <Input
                      type="number"
                      value={formulario.valorOriginal}
                      onChange={(e) => alterar("valorOriginal", e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={4}>
                  <FormControl>
                    <FormLabel>Valor Parcelado *</FormLabel>
                    <Input
                      type="number"
                      value={formulario.valorParcelado}
                      onChange={(e) =>
                        alterar("valorParcelado", e.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid xs={4}>
                  <FormControl>
                    <FormLabel>Desconto *</FormLabel>
                    <Input
                      type="number"
                      value={formulario.desconto}
                      onChange={(e) => alterar("desconto", e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={12}>
                  <FormControl>
                    <FormLabel>Descrição *</FormLabel>
                    <Input
                      value={formulario.descricao}
                      onChange={(e) => alterar("descricao", e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={12}>
                  <FormControl>
                    <FormLabel>Imagens *</FormLabel>
                    <Button
                      component="label"
                      variant="solid"
                      color="primary"
                      startDecorator={
                        <SvgIcon>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                            />
                          </svg>
                        </SvgIcon>
                      }
                    >
                      Enviar Imagens
                      <EntradaOculta
                        type="file"
                        multiple
                        onChange={(e) => {
                          const arquivos = Array.from(e.target.files || []);
                          setImagensUpload((ant) => [...ant, ...arquivos]);
                        }}
                      />
                    </Button>
                  </FormControl>

                  {imagensUpload.length > 0 && (
                    <Box
                      sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}
                    >
                      {imagensUpload.map((img, i) => (
                        <CaixaImagem key={`up-${i}`}>
                          <Box
                            component="img"
                            src={URL.createObjectURL(img)}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              cursor: "pointer",
                              borderRadius: 10,
                              border: "2px solid transparent",
                              bgcolor: "rgba(255,255,255,0.05)",
                              transition: "border-color 0.3s",
                              "&:hover": {
                                borderColor: "rgba(255,255,255,0.3)",
                              },
                            }}
                          />
                          <SobreposicaoHover
                            onClick={() => removerImagemUpload(i)}
                          >
                            <DeleteIcon
                              sx={{ width: 50, height: 50, color: "#fff" }}
                            />
                          </SobreposicaoHover>
                        </CaixaImagem>
                      ))}
                    </Box>
                  )}
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Tipo do Produto *</FormLabel>
                    <Select
                      value={String(formulario.tipoProduto) || ""}
                      onChange={(_, v) => alterar("tipoProduto", Number(v))}
                    >
                      <Option value="1">iPhone</Option>
                      <Option value="2">Mac</Option>
                      <Option value="3">Acessórios</Option>
                      <Option value="4">Outros</Option>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid xs={3}>
                  <FormControl>
                    <FormLabel>Meses de Garantia *</FormLabel>
                    <Input
                      type="number"
                      value={formulario.mesesGarantia}
                      onChange={(e) => alterar("mesesGarantia", e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={3}>
                  <FormControl>
                    <FormLabel>Quantidade</FormLabel>
                    <Input
                      type="number"
                      value={formulario.quantidade}
                      onChange={(e) => alterar("quantidade", e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={4}>
                  <FormControl>
                    <FormLabel>Cor *</FormLabel>
                    <Input
                      value={formulario.color}
                      onChange={(e) => alterar("color", e.target.value)}
                      startDecorator={
                        <input
                          type="color"
                          value={formulario.color == "" ? "#000000" : formulario.color}
                          onChange={(e) => alterar("color", e.target.value)}
                          style={{
                            width: "32px",
                            height: "32px",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                          }}
                        />
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid xs={5}>
                  <FormControl>
                    <FormLabel>Nome da Cor *</FormLabel>
                    <Input
                      value={formulario.colorName}
                      onChange={(e) => alterar("colorName", e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={1} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <FormControl orientation="horizontal">
                    <FormLabel>Disponível</FormLabel>
                    <Switch
                      checked={formulario.disponivel}
                      onChange={(e) => alterar("disponivel", e.target.checked)}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={1}>
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Marca</FormLabel>
                    <Input
                      value={formulario.informacoesProduto.marca ?? ""}
                      onChange={(e) => alterarInfo("marca", e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Armazenamento Interno</FormLabel>
                    <Input
                      value={
                        formulario.informacoesProduto.armazenamentoInterno ??
                        ""
                      }
                      onChange={(e) =>
                        alterarInfo("armazenamentoInterno", e.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Tipo de Tela</FormLabel>
                    <Input
                      value={formulario.informacoesProduto.tipoTela ?? ""}
                      onChange={(e) => alterarInfo("tipoTela", e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Tamanho da Tela</FormLabel>
                    <Input
                      value={formulario.informacoesProduto.tamanhoTela ?? ""}
                      onChange={(e) =>
                        alterarInfo("tamanhoTela", e.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Resolução da Tela</FormLabel>
                    <Input
                      value={
                        formulario.informacoesProduto.resolucaoTela ?? ""
                      }
                      onChange={(e) =>
                        alterarInfo("resolucaoTela", e.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Tecnologia</FormLabel>
                    <Input
                      value={formulario.informacoesProduto.tecnologia ?? ""}
                      onChange={(e) =>
                        alterarInfo("tecnologia", e.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Processador</FormLabel>
                    <Input
                      value={formulario.informacoesProduto.processador ?? ""}
                      onChange={(e) =>
                        alterarInfo("processador", e.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Sistema Operacional</FormLabel>
                    <Input
                      value={
                        formulario.informacoesProduto.sistemaOperacional ??
                        ""
                      }
                      onChange={(e) =>
                        alterarInfo("sistemaOperacional", e.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Câmera Traseira</FormLabel>
                    <Input
                      value={
                        formulario.informacoesProduto.cameraTraseira ?? ""
                      }
                      onChange={(e) =>
                        alterarInfo("cameraTraseira", e.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Câmera Frontal</FormLabel>
                    <Input
                      value={
                        formulario.informacoesProduto.cameraFrontal ?? ""
                      }
                      onChange={(e) =>
                        alterarInfo("cameraFrontal", e.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Bateria</FormLabel>
                    <Input
                      value={formulario.informacoesProduto.bateria ?? ""}
                      onChange={(e) => alterarInfo("bateria", e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Quantidade de Chips</FormLabel>
                    <Input
                      value={
                        formulario.informacoesProduto.quantidadeChips ?? ""
                      }
                      onChange={(e) =>
                        alterarInfo("quantidadeChips", e.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Material</FormLabel>
                    <Input
                      value={formulario.informacoesProduto.material ?? ""}
                      onChange={(e) => alterarInfo("material", e.target.value)}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </TabPanel>
          </Tabs>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
          >
            <Button
              sx={{ width: 90 }}
              variant="outlined"
              color="neutral"
              onClick={onClose}
            >
              Cancelar
            </Button>
            {isLoading ? (
              <Button sx={{ width: 90 }} loading variant="solid">
                Solid
              </Button>
            ) : (
              <Button
                sx={{ width: 90 }}
                variant="solid"
                color="primary"
                onClick={salvar}
              >
                Salvar
              </Button>
            )}
          </Box>
        </ModalDialog>
      </Modal>
      <Alerta
        mensagem={alertaMensagem}
        tipo={alertaTipo}
        aberto={alertaAberto}
        aoFechar={() => setAlertaAberto(false)}
      />
    </Container>
  );
}
