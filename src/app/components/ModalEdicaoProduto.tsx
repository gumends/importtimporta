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
  Select,
  Option,
  CircularProgress,
} from "@mui/joy";
import Alerta from "./Alerta";
import { ProdutoService } from "@/services/produto/produto.service";
import { Produto } from "@/types/ProdutoNovo.type";

interface Props {
  open: boolean;
  onClose: () => void;
  idProduto: string;
  onSaved: () => void;
}

type TipoAlerta = "success" | "danger" | "warning" | "primary" | "neutral";

function mapProdutoApi(data: unknown): Produto {
  const raw = data as Record<string, unknown>;
  const info =
    raw.informacoesAdicionais ?? raw.informacoesProduto ?? null;
  const imagens = Array.isArray(raw.imagens) ? raw.imagens : [];
  return {
    ...(raw as unknown as Produto),
    informacoesAdicionais: info as Produto["informacoesAdicionais"],
    imagens: imagens as Produto["imagens"],
  };
}

export default function ModalEditarProduto({
  open,
  onClose,
  idProduto,
  onSaved,
}: Props) {
  const produtoService = new ProdutoService();
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [imagensExistentes, setImagensExistentes] = useState<string[]>([]);
  const [informacoesProdutoId, setInformacoesProdutoId] = useState("");

  const [formulario, setFormulario] = useState({
    nomeProduto: "",
    valorOriginal: "",
    valorParcelado: "",
    desconto: "",
    descricao: "",
    tipoProduto: 1,
    disponivel: true,
    mesesGarantia: "",
    quantidade: "",
    color: "",
    colorName: "",
  });

  const [alertaAberto, setAlertaAberto] = useState(false);
  const [alertaMensagem, setAlertaMensagem] = useState("");
  const [alertaTipo, setAlertaTipo] = useState<TipoAlerta>("neutral");

  const mostrarAlerta = (msg: string, tipo: TipoAlerta) => {
    setAlertaMensagem(msg);
    setAlertaTipo(tipo);
    setAlertaAberto(true);
  };

  useEffect(() => {
    if (!open || !idProduto) return;

    const carregar = async () => {
      setCarregando(true);
      try {
        const raw = await produtoService.getProdutoPorId(idProduto);
        const p = mapProdutoApi(raw);
        setFormulario({
          nomeProduto: p.nomeProduto ?? "",
          valorOriginal: String(p.valorOriginal ?? ""),
          valorParcelado: String(p.valorParcelado ?? ""),
          desconto: String(p.desconto ?? ""),
          descricao: p.descricao ?? "",
          tipoProduto: p.tipoProduto ?? 1,
          disponivel: p.disponivel ?? true,
          mesesGarantia: String(p.mesesGarantia ?? ""),
          quantidade: String(p.quantidade ?? ""),
          color: p.color ?? "",
          colorName: p.colorName ?? "",
        });
        setImagensExistentes(
          (p.imagens ?? []).map((img) => img.caminho).filter(Boolean),
        );
        setInformacoesProdutoId(
          String(
            (raw as unknown as Record<string, unknown>).informacoesProdutoId ??
              p.informacoesAdicionais?.id ??
              "",
          ),
        );
      } catch {
        mostrarAlerta("Erro ao carregar produto.", "danger");
      } finally {
        setCarregando(false);
      }
    };

    void carregar();
  }, [open, idProduto]);

  const salvar = async () => {
    if (!idProduto) return;
    setSalvando(true);
    try {
      const fd = new FormData();
      fd.append("Id", idProduto);
      fd.append("NomeProduto", formulario.nomeProduto);
      fd.append("ValorOriginal", formulario.valorOriginal);
      fd.append("ValorParcelado", formulario.valorParcelado);
      fd.append("Desconto", formulario.desconto);
      fd.append("Descricao", formulario.descricao);
      fd.append("TipoProduto", String(formulario.tipoProduto));
      fd.append("Disponivel", String(formulario.disponivel));
      fd.append("MesesGarantia", formulario.mesesGarantia);
      fd.append("Quantidade", formulario.quantidade);
      fd.append("Color", formulario.color);
      fd.append("ColorName", formulario.colorName);
      if (informacoesProdutoId) {
        fd.append("InformacoesProdutoId", informacoesProdutoId);
      }

      imagensExistentes.forEach((url) => {
        fd.append("imagensExistentes", url);
      });

      await produtoService.atualizarProdutoFormData(idProduto, fd);
      mostrarAlerta("Produto atualizado com sucesso!", "success");
      onSaved();
      onClose();
    } catch (err) {
      mostrarAlerta(
        err instanceof Error ? err.message : "Erro ao salvar alterações.",
        "danger",
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <ModalDialog
          sx={{
            width: { xs: "95vw", sm: 640 },
            maxHeight: "90vh",
            overflowY: "auto",
            background: "#111",
          }}
        >
          <Typography level="h4" sx={{ mb: 2 }}>
            Editar produto
          </Typography>

          {carregando ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid xs={12}>
                <FormControl>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    value={formulario.nomeProduto}
                    onChange={(e) =>
                      setFormulario((f) => ({
                        ...f,
                        nomeProduto: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </Grid>
              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Valor original</FormLabel>
                  <Input
                    type="number"
                    value={formulario.valorOriginal}
                    onChange={(e) =>
                      setFormulario((f) => ({
                        ...f,
                        valorOriginal: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </Grid>
              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Desconto</FormLabel>
                  <Input
                    type="number"
                    value={formulario.desconto}
                    onChange={(e) =>
                      setFormulario((f) => ({
                        ...f,
                        desconto: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </Grid>
              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Valor parcelado</FormLabel>
                  <Input
                    type="number"
                    value={formulario.valorParcelado}
                    onChange={(e) =>
                      setFormulario((f) => ({
                        ...f,
                        valorParcelado: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </Grid>
              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Estoque</FormLabel>
                  <Input
                    type="number"
                    value={formulario.quantidade}
                    onChange={(e) =>
                      setFormulario((f) => ({
                        ...f,
                        quantidade: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </Grid>
              <Grid xs={12}>
                <FormControl>
                  <FormLabel>Descrição</FormLabel>
                  <Input
                    value={formulario.descricao}
                    onChange={(e) =>
                      setFormulario((f) => ({
                        ...f,
                        descricao: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </Grid>
              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={formulario.tipoProduto}
                    onChange={(_, v) =>
                      setFormulario((f) => ({
                        ...f,
                        tipoProduto: Number(v ?? 1),
                      }))
                    }
                  >
                    <Option value={1}>iPhones</Option>
                    <Option value={2}>Macs</Option>
                    <Option value={3}>Acessórios</Option>
                    <Option value={4}>Outros</Option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Garantia (meses)</FormLabel>
                  <Input
                    type="number"
                    value={formulario.mesesGarantia}
                    onChange={(e) =>
                      setFormulario((f) => ({
                        ...f,
                        mesesGarantia: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </Grid>
              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Cor (hex)</FormLabel>
                  <Input
                    value={formulario.color}
                    onChange={(e) =>
                      setFormulario((f) => ({ ...f, color: e.target.value }))
                    }
                  />
                </FormControl>
              </Grid>
              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Nome da cor</FormLabel>
                  <Input
                    value={formulario.colorName}
                    onChange={(e) =>
                      setFormulario((f) => ({
                        ...f,
                        colorName: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </Grid>
              <Grid xs={12}>
                <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                  <Switch
                    checked={formulario.disponivel}
                    onChange={(e) =>
                      setFormulario((f) => ({
                        ...f,
                        disponivel: e.target.checked,
                      }))
                    }
                  />
                  <FormLabel>Disponível na loja</FormLabel>
                </FormControl>
              </Grid>
            </Grid>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
          >
            <Button variant="outlined" color="neutral" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="solid"
              color="primary"
              loading={salvando}
              disabled={carregando}
              onClick={() => void salvar()}
            >
              Salvar
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
