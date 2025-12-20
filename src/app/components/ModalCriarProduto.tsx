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
} from "@mui/joy";
import { styled } from "@mui/joy";
import Alerta from "./Alerta";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";
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
  const apiUrl = "https://api.importtimporta.com.br";
  const [aba, setAba] = useState(0);

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
    id: 0,
    nomeProduto: "",
    valorOriginal: "",
    valorParcelado: "",
    desconto: "",
    descricao: "",
    tipoProduto: "",
    novoLancamento: false,
    novaGeracao: false,
    disponivel: true,
    mesesGarantia: "",
    informacoesAdicionais: {
      id: 0,
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
    informacoesAdicionaisId: 0,
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

      const tokenCookie = Cookies.get("auth_token");
      console.log("Token", tokenCookie);

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
        ...anterior.informacoesAdicionais,
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
    setIsLoading(true);
    if (!validarFormulario()) {
      mostrarAlerta(
        "Por favor, preencha todos os campos obrigatórios.",
        "danger"
      );
      setIsLoading(false);
      return;
    }

    const url = `${apiUrl}/produto`;
    const metodo = "POST";

    const dados = new FormData();

    dados.append("Id", formulario.id.toString());
    dados.append("NomeProduto", formulario.nomeProduto);
    dados.append("ValorOriginal", formulario.valorOriginal);
    dados.append("ValorParcelado", formulario.valorParcelado);
    dados.append("Desconto", formulario.desconto);
    dados.append("Descricao", formulario.descricao);
    dados.append("TipoProduto", String(formulario.tipoProduto));
    dados.append("NovoLancamento", String(formulario.novoLancamento));
    dados.append("NovaGeracao", String(formulario.novaGeracao));
    dados.append("Disponivel", String(formulario.disponivel));
    dados.append("MesesGarantia", formulario.mesesGarantia);
    dados.append(
      "InformacoesAdicionaisId",
      formulario.informacoesAdicionaisId.toString()
    );
    dados.append("Color", formulario.color);
    dados.append("ColorName", formulario.colorName);

    const info = formulario.informacoesAdicionais;

    Object.entries(info).forEach(([k, v]) => {
      const value =
        v === null || v === undefined
          ? ""
          : typeof v === "object"
          ? JSON.stringify(v)
          : String(v);
      dados.append(`InformacoesAdicionais.${k}`, value);
    });

    imagensUpload.forEach((img) => dados.append("imagens", img));

    const resposta = await fetch(url, {
      method: metodo,
      body: dados,
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!resposta.ok) {
      mostrarAlerta("Erro ao salvar o produto.", "danger");
      setIsLoading(false);
      return;
    }

    mostrarAlerta("Produto salvo com sucesso!", "success");
    setIsLoading(false);
    onSaved();
    onClose();
  };

  return (
    <>
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
                        <DeleteIcon
                          sx={{ width: 50, height: 50, color: "#fff" }}
                        />
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
                      onChange={(_, v) => alterar("tipoProduto", v ?? "")}
                    >
                      <Option value="1">iPhone</Option>
                      <Option value="2">Mac</Option>
                      <Option value="3">Acessórios</Option>
                      <Option value="4">Outros</Option>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Meses de Garantia *</FormLabel>
                    <Input
                      type="number"
                      value={formulario.mesesGarantia}
                      onChange={(e) => alterar("mesesGarantia", e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={4}>
                  <FormControl orientation="horizontal">
                    <FormLabel>Disponível</FormLabel>
                    <Switch
                      checked={formulario.disponivel}
                      onChange={(e) => alterar("disponivel", e.target.checked)}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={4}>
                  <FormControl orientation="horizontal">
                    <FormLabel>Novo Lançamento</FormLabel>
                    <Switch
                      checked={formulario.novoLancamento}
                      onChange={(e) =>
                        alterar("novoLancamento", e.target.checked)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid xs={4}>
                  <FormControl orientation="horizontal">
                    <FormLabel>Nova Geração</FormLabel>
                    <Switch
                      checked={formulario.novaGeracao}
                      onChange={(e) => alterar("novaGeracao", e.target.checked)}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Cor *</FormLabel>
                    <Input
                      value={formulario.color}
                      onChange={(e) => alterar("color", e.target.value)}
                      startDecorator={
                        <input
                          type="color"
                          value={formulario.color}
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

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Nome da Cor *</FormLabel>
                    <Input
                      value={formulario.colorName}
                      onChange={(e) => alterar("colorName", e.target.value)}
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
                      value={formulario.informacoesAdicionais.marca ?? ""}
                      onChange={(e) => alterarInfo("marca", e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Armazenamento Interno</FormLabel>
                    <Input
                      value={
                        formulario.informacoesAdicionais.armazenamentoInterno ??
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
                      value={formulario.informacoesAdicionais.tipoTela ?? ""}
                      onChange={(e) => alterarInfo("tipoTela", e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Tamanho da Tela</FormLabel>
                    <Input
                      value={formulario.informacoesAdicionais.tamanhoTela ?? ""}
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
                        formulario.informacoesAdicionais.resolucaoTela ?? ""
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
                      value={formulario.informacoesAdicionais.tecnologia ?? ""}
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
                      value={formulario.informacoesAdicionais.processador ?? ""}
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
                        formulario.informacoesAdicionais.sistemaOperacional ??
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
                        formulario.informacoesAdicionais.cameraTraseira ?? ""
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
                        formulario.informacoesAdicionais.cameraFrontal ?? ""
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
                      value={formulario.informacoesAdicionais.bateria ?? ""}
                      onChange={(e) => alterarInfo("bateria", e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Quantidade de Chips</FormLabel>
                    <Input
                      value={
                        formulario.informacoesAdicionais.quantidadeChips ?? ""
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
                      value={formulario.informacoesAdicionais.material ?? ""}
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
    </>
  );
}
