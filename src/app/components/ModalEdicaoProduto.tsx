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
import SvgIcon from "@mui/joy/SvgIcon";
import { styled } from "@mui/joy";
import Alerta from "./Alerta";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProdutoService } from "@/services/auth/produto.service";
import { IImagem, Produto } from "@/types/ProdutoNovo.type";

interface Props {
  open: boolean;
  onClose: () => void;
  idProduto: number;
  onSaved: () => void;
}


export default function ModalEditarProduto({
  open,
  onClose,
  idProduto,
  onSaved,
}: Props) {
  const apiUrl = "https://api.importtimporta.com.br";

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

  const [aba, setAba] = useState(0);

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
  const [imagensApi, setImagensApi] = useState<string[]>([]);
  const [imagensUpload, setImagensUpload] = useState<File[]>([]);

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

  function produtoParaFormulario(produto: Produto): FormularioProduto {
    return {
      id: produto.id,
      nomeProduto: produto.nomeProduto,
      valorOriginal: produto.valorOriginal.toString(),
      valorParcelado: produto.valorParcelado.toString(),
      desconto: produto.desconto.toString(),
      descricao: produto.descricao,
      tipoProduto: String(produto.tipoProduto),
      novoLancamento: produto.novoLancamento,
      novaGeracao: produto.novaGeracao ?? false,
      disponivel: produto.disponivel,
      mesesGarantia: produto.mesesGarantia.toString(),
      informacoesAdicionaisId: produto.informacoesAdicionaisId ?? 0,
      color: produto.color,
      colorName: produto.colorName,
      informacoesAdicionais: {
        id: produto.informacoesAdicionais?.id ?? 0,
        marca: produto.informacoesAdicionais?.marca ?? "",
        armazenamentoInterno:
          produto.informacoesAdicionais?.armazenamentoInterno ?? "",
        tipoTela: produto.informacoesAdicionais?.tipoTela ?? "",
        tamanhoTela: produto.informacoesAdicionais?.tamanhoTela ?? "",
        resolucaoTela: produto.informacoesAdicionais?.resolucaoTela ?? "",
        tecnologia: produto.informacoesAdicionais?.tecnologia ?? "",
        processador: produto.informacoesAdicionais?.processador ?? "",
        sistemaOperacional:
          produto.informacoesAdicionais?.sistemaOperacional ?? "",
        cameraTraseira: produto.informacoesAdicionais?.cameraTraseira ?? "",
        cameraFrontal: produto.informacoesAdicionais?.cameraFrontal ?? "",
        bateria: produto.informacoesAdicionais?.bateria ?? "",
        quantidadeChips: produto.informacoesAdicionais?.quantidadeChips ?? "",
        material: produto.informacoesAdicionais?.material ?? "",
      },
    };
  }

  const buscarProduto = async () => {
    try {
      const produto = await produtoService.getProdutoPorId(idProduto);

      setFormulario(produtoParaFormulario(produto));

      setImagensApi(produto.imagens?.map((x: IImagem) => x.caminho) || []);
      setImagensUpload([]);
    } catch (err) {
      mostrarAlerta("Erro ao carregar produto.", "danger");
    }
  };

  useEffect(() => {
    if (open && idProduto) {
      buscarProduto();
      setAba(0);
    }
  }, [open, idProduto]);

  const alterar = <K extends keyof FormularioProduto>(
    campo: K,
    valor: FormularioProduto[K]
  ) => {
    setFormulario((ant) => ({ ...ant, [campo]: valor }));
  };

  const alterarInfo = <K extends keyof InformacoesAdicionais>(
    campo: K,
    valor: InformacoesAdicionais[K]
  ) => {
    setFormulario((ant) => ({
      ...ant,
      informacoesAdicionais: {
        ...ant.informacoesAdicionais,
        [campo]: valor,
      },
    }));
  };

  const removerImagemApi = (i: number) => {
    setImagensApi((ant) => ant.filter((_, idx) => idx !== i));
  };

  const removerImagemUpload = (i: number) => {
    setImagensUpload((ant) => ant.filter((_, idx) => idx !== i));
  };

  const validarFormulario = () => {
    if (imagensApi.length === 0 && imagensUpload.length === 0) return false;

    return true;
  };

  const salvar = async () => {
    if (!validarFormulario()) {
      mostrarAlerta(
        "Por favor, preencha todos os campos obrigatórios.",
        "danger"
      );
      return;
    }

    const formData = new FormData();

    formData.append("Id", formulario.id.toString());
    formData.append("NomeProduto", formulario.nomeProduto);
    formData.append("ValorOriginal", formulario.valorOriginal);
    formData.append("ValorParcelado", formulario.valorParcelado);
    formData.append("Desconto", formulario.desconto);
    formData.append("Descricao", formulario.descricao);
    formData.append("TipoProduto", String(formulario.tipoProduto));
    formData.append("NovoLancamento", String(formulario.novoLancamento));
    formData.append("NovaGeracao", String(formulario.novaGeracao));
    formData.append("Disponivel", String(formulario.disponivel));
    formData.append("MesesGarantia", formulario.mesesGarantia);
    formData.append(
      "InformacoesAdicionaisId",
      formulario.informacoesAdicionaisId.toString()
    );
    formData.append("Color", formulario.color);
    formData.append("ColorName", formulario.colorName);

    const info = formulario.informacoesAdicionais;

    Object.entries(info).forEach(([k, v]) => {
      formData.append(`InformacoesAdicionais.${k}`, v?.toString() ?? "");
    });

    imagensApi.forEach((url) => {
      formData.append("imagensExistentes", url);
    });

    imagensUpload.forEach((img) => formData.append("imagens", img));

    const res = await fetch(`${apiUrl}/produto/${idProduto}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
      },
      body: formData,
    });

    if (!res.ok) {
      mostrarAlerta("Erro ao salvar alterações.", "danger");
      return;
    }

    mostrarAlerta("Produto atualizado com sucesso!", "success");
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
            Editar Produto
          </Typography>

          <Tabs value={aba} onChange={(_, v) => setAba(Number(v))}>
            <TabList>
              <Tab>Produto</Tab>
              <Tab>Informações Adicionais</Tab>
            </TabList>

            {/* ABA 1 */}
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

                {/* Imagens */}
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
                      Enviar imagens
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

                  <Box
                    sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}
                  >
                    {imagensApi.map((url, i) => (
                      <CaixaImagem key={`api-${i}`}>
                        <Box
                          component="img"
                          src={url}
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
                        <SobreposicaoHover onClick={() => removerImagemApi(i)}>
                          <DeleteIcon
                            sx={{ width: 50, height: 50, color: "#fff" }}
                          />
                        </SobreposicaoHover>
                      </CaixaImagem>
                    ))}

                    {imagensUpload.map((file, i) => (
                      <CaixaImagem key={`upload-${i}`}>
                        <Box
                          component="img"
                          src={URL.createObjectURL(file)}
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
                </Grid>

                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Tipo do Produto *</FormLabel>
                    <Select
                      value={formulario.tipoProduto.toString() || ""}
                      onChange={(_, v) => alterar("tipoProduto", v ?? "")}
                    >
                      <Option value={1}>iPhone</Option>
                      <Option value={2}>Mac</Option>
                      <Option value={3}>Acessórios</Option>
                      <Option value={4}>Outros</Option>
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

            {/* ABA 2 */}
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
            <Button variant="outlined" color="neutral" onClick={onClose}>
              Cancelar
            </Button>

            <Button variant="solid" color="primary" onClick={salvar}>
              Salvar Alterações
            </Button>
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
