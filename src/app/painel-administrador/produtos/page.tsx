"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  Sheet,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
  Stack,
  Input,
  Container,
  Alert,
  FormControl,
  FormLabel,
  Snackbar,
} from "@mui/joy";
import NextLink from "next/link";
import {
  Add,
  ArrowBack,
  ChevronRight,
  DeleteOutline,
  EditOutlined,
  LockOpenOutlined,
  LockOutlined,
  Search,
  ShoppingBagOutlined,
} from "@mui/icons-material";
import { ProdutosResponse, Produto } from "@/types/ProdutoNovo.type";
import { PaginationJoy } from "@/app/components/PaginationJoy";
import { ProdutoService } from "@/services/produto/produto.service";
import ConfirmModal from "@/app/components/ConfirmModal";
import ModalCriarProduto from "@/app/components/ModalCriarProduto";
import ModalEditarProduto from "@/app/components/ModalEdicaoProduto";
import { formatarDinheiro } from "@/utils/mascara_dinheiro";
import { GoogleAuthService } from "@/services/auth/auth.service";

const ADMIN_ROLE = 1;

const TIPOS_PRODUTO: Record<number, string> = {
  1: "iPhones",
  2: "Macs",
  3: "Acessórios",
  4: "Outros",
};

function truncarId(id: string) {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

export default function ProdutosPage() {
  const produtoService = new ProdutoService();
  const auth = new GoogleAuthService();

  const [data, setData] = useState<ProdutosResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [acessoNegado, setAcessoNegado] = useState(false);
  const [autorizado, setAutorizado] = useState(false);

  const [modalOpenCriar, setModalOpenCriar] = useState(false);
  const [modalOpenEditar, setModalOpenEditar] = useState(false);
  const [produtoEdit, setProdutoEdit] = useState<Produto | null>(null);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openConfirmToggle, setOpenConfirmToggle] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null,
  );

  const [nomeFiltro, setNomeFiltro] = useState("");
  const [precoMinFiltro, setPrecoMinFiltro] = useState("");
  const [precoMaxFiltro, setPrecoMaxFiltro] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    msg: string;
    color: "success" | "danger";
  }>({ open: false, msg: "", color: "success" });

  const fetchProdutos = async (pagina: number) => {
    try {
      setLoading(true);
      const res = await produtoService.getProdutos({
        pagina,
        nomeProduto: nomeFiltro.trim() || undefined,
        precoMinimo: precoMinFiltro ? Number(precoMinFiltro) : undefined,
        precoMaximo: precoMaxFiltro ? Number(precoMaxFiltro) : undefined,
      });
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verificarAcesso = async () => {
      try {
        const token = sessionStorage.getItem("auth_token");
        if (!token) {
          setAcessoNegado(true);
          setLoading(false);
          return;
        }
        const me = await auth.me();
        if (!me?.email || me.role !== ADMIN_ROLE) {
          setAcessoNegado(true);
          setLoading(false);
          return;
        }
        setAutorizado(true);
      } catch {
        setAcessoNegado(true);
        setLoading(false);
      }
    };
    verificarAcesso();
  }, []);

  useEffect(() => {
    if (!autorizado) return;
    fetchProdutos(page);
  }, [page, autorizado]);

  const aplicarFiltros = () => {
    setPage(1);
    fetchProdutos(1);
  };

  const limparFiltros = () => {
    setNomeFiltro("");
    setPrecoMinFiltro("");
    setPrecoMaxFiltro("");
    setPage(1);
    produtoService
      .getProdutos({ pagina: 1 })
      .then(setData)
      .catch(() => setData(null));
  };

  const deletarProduto = async (id: string) => {
    try {
      await produtoService.deletarProduto(id);
      setOpenConfirmDelete(false);
      setSnackbar({
        open: true,
        msg: "Produto excluído.",
        color: "success",
      });
      fetchProdutos(page);
    } catch (err) {
      setSnackbar({
        open: true,
        msg:
          err instanceof Error
            ? err.message
            : "Não foi possível excluir. Faça logout/login se virou admin recentemente.",
        color: "danger",
      });
    }
  };

  const alternarDisponibilidade = async (produto: Produto) => {
    try {
      if (produto.disponivel) {
        await produtoService.desativarProduto(produto.id);
      } else {
        await produtoService.ativarProduto(produto.id);
      }
      setOpenConfirmToggle(false);
      setProdutoSelecionado(null);
      setSnackbar({
        open: true,
        msg: produto.disponivel ? "Produto desativado." : "Produto ativado.",
        color: "success",
      });
      fetchProdutos(page);
    } catch (err) {
      setSnackbar({
        open: true,
        msg:
          err instanceof Error
            ? err.message
            : "Falha ao alterar status. Tente sair e entrar de novo.",
        color: "danger",
      });
    }
  };

  if (acessoNegado) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, px: 2 }}>
        <Alert color="danger" variant="soft" sx={{ mb: 2 }}>
          Acesso restrito a administradores.
        </Alert>
        <Button component={NextLink} href="/inicio" variant="soft">
          Ir para a loja
        </Button>
      </Container>
    );
  }

  const listaVazia = !loading && data && data.itens.length === 0;

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          width: "100%",
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 3 },
          minHeight: "calc(100vh - 120px)",
        }}
      >
        <Stack spacing={3}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Button
              component={NextLink}
              href="/painel-administrador"
              variant="plain"
              color="neutral"
              size="sm"
              startDecorator={<ArrowBack />}
            >
              Painel
            </Button>
            <ChevronRight sx={{ color: "neutral.600", fontSize: 18 }} />
            <Typography level="body-sm" sx={{ color: "neutral.400" }}>
              Produtos
            </Typography>
          </Stack>

          <Box
            sx={{
              borderRadius: "xl",
              p: { xs: 2.5, md: 3 },
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(10,10,10,0.5) 100%)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={2}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <ShoppingBagOutlined sx={{ color: "#60a5fa" }} />
                  <Chip size="sm" variant="soft" color="primary">
                    Catálogo
                  </Chip>
                </Stack>
                <Typography level="h2" sx={{ fontWeight: 700, color: "#fff" }}>
                  Produtos
                </Typography>
                <Typography level="body-sm" sx={{ color: "neutral.400", mt: 0.5 }}>
                  {data
                    ? `${data.totalItens} item(ns) · página ${data.paginaAtual} de ${Math.max(data.totalPaginas, 1)}`
                    : "Gerencie nomes, preços, estoque e disponibilidade"}
                </Typography>
              </Box>
              <Button
                startDecorator={<Add />}
                onClick={() => setModalOpenCriar(true)}
                sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}
              >
                Novo produto
              </Button>
            </Stack>
          </Box>

          <Sheet
            variant="outlined"
            sx={{
              borderRadius: "lg",
              p: 2,
              bgcolor: "#121212",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <Typography level="title-sm" sx={{ mb: 2, color: "neutral.300" }}>
              Filtros
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ md: "flex-end" }}
            >
              <FormControl sx={{ flex: 2, minWidth: 200 }}>
                <FormLabel>Nome</FormLabel>
                <Input
                  placeholder="Buscar por nome..."
                  value={nomeFiltro}
                  onChange={(e) => setNomeFiltro(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && aplicarFiltros()}
                  startDecorator={<Search />}
                />
              </FormControl>
              <FormControl sx={{ flex: 1, minWidth: 120 }}>
                <FormLabel>Preço mín.</FormLabel>
                <Input
                  type="number"
                  placeholder="0"
                  value={precoMinFiltro}
                  onChange={(e) => setPrecoMinFiltro(e.target.value)}
                />
              </FormControl>
              <FormControl sx={{ flex: 1, minWidth: 120 }}>
                <FormLabel>Preço máx.</FormLabel>
                <Input
                  type="number"
                  placeholder="99999"
                  value={precoMaxFiltro}
                  onChange={(e) => setPrecoMaxFiltro(e.target.value)}
                />
              </FormControl>
              <Stack direction="row" spacing={1}>
                <Button onClick={aplicarFiltros}>Filtrar</Button>
                <Button variant="outlined" color="neutral" onClick={limparFiltros}>
                  Limpar
                </Button>
              </Stack>
            </Stack>
          </Sheet>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size="lg" />
            </Box>
          )}

          {listaVazia && (
            <Sheet
              variant="soft"
              sx={{
                py: 8,
                px: 3,
                textAlign: "center",
                borderRadius: "lg",
                bgcolor: "rgba(255,255,255,0.03)",
              }}
            >
              <Typography level="h4" sx={{ mb: 1 }}>
                Nenhum produto encontrado
              </Typography>
              <Typography level="body-sm" sx={{ color: "neutral.500", mb: 2 }}>
                Ajuste os filtros ou cadastre o primeiro item do catálogo.
              </Typography>
              <Button startDecorator={<Add />} onClick={() => setModalOpenCriar(true)}>
                Cadastrar produto
              </Button>
            </Sheet>
          )}

          {!loading && data && data.itens.length > 0 && (
            <>
              <Sheet
                variant="outlined"
                sx={{
                  borderRadius: "lg",
                  overflow: "auto",
                  bgcolor: "#121212",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <Table
                  borderAxis="none"
                  stripe="odd"
                  hoverRow
                  sx={{
                    "& thead th": {
                      bgcolor: "rgba(255,255,255,0.04)",
                      fontWeight: 600,
                      fontSize: "xs",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: "neutral.400",
                    },
                    "& tbody td": { verticalAlign: "middle" },
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: 56 }} />
                      <th>Produto</th>
                      <th>Valor</th>
                      <th>Estoque</th>
                      <th>Status</th>
                      <th>Categoria</th>
                      <th>Cor</th>
                      <th style={{ width: 140, textAlign: "right" }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.itens.map((p) => {
                      const imagem =
                        p.imagens?.[0]?.caminho ?? "/placeholder.png";
                      const valor = p.valor ?? p.valorOriginal;

                      return (
                        <tr key={p.id}>
                          <td>
                            <Box
                              component="img"
                              src={imagem}
                              alt=""
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "md",
                                objectFit: "cover",
                                bgcolor: "neutral.800",
                              }}
                            />
                          </td>
                          <td>
                            <Typography level="title-sm">{p.nomeProduto}</Typography>
                            <Typography level="body-xs" sx={{ color: "neutral.500" }}>
                              ID {truncarId(p.id)}
                            </Typography>
                          </td>
                          <td>
                            <Typography level="body-sm" fontWeight="md">
                              {formatarDinheiro(Number(valor))}
                            </Typography>
                            {p.desconto > 0 && (
                              <Typography level="body-xs" sx={{ color: "success.400" }}>
                                −{formatarDinheiro(Number(p.desconto))}
                              </Typography>
                            )}
                          </td>
                          <td>
                            <Typography level="body-sm">{p.quantidade}</Typography>
                          </td>
                          <td>
                            <Chip
                              size="sm"
                              variant="soft"
                              color={p.disponivel ? "success" : "neutral"}
                            >
                              {p.disponivel ? "Ativo" : "Inativo"}
                            </Chip>
                          </td>
                          <td>
                            <Chip size="sm" variant="outlined" color="neutral">
                              {TIPOS_PRODUTO[p.tipoProduto] ?? "—"}
                            </Chip>
                          </td>
                          <td>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box
                                sx={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: "50%",
                                  bgcolor: p.color || "#666",
                                  border: "1px solid rgba(255,255,255,0.2)",
                                }}
                              />
                              <Typography level="body-xs">{p.colorName}</Typography>
                            </Stack>
                          </td>
                          <td>
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              <Tooltip title="Editar">
                                <IconButton
                                  size="sm"
                                  variant="soft"
                                  color="warning"
                                  onClick={() => {
                                    setProdutoEdit(p);
                                    setModalOpenEditar(true);
                                  }}
                                >
                                  <EditOutlined fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={p.disponivel ? "Desativar" : "Ativar"}>
                                <IconButton
                                  size="sm"
                                  variant="soft"
                                  color={p.disponivel ? "neutral" : "success"}
                                  onClick={() => {
                                    setProdutoSelecionado(p);
                                    setOpenConfirmToggle(true);
                                  }}
                                >
                                  {p.disponivel ? (
                                    <LockOutlined fontSize="small" />
                                  ) : (
                                    <LockOpenOutlined fontSize="small" />
                                  )}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir">
                                <IconButton
                                  size="sm"
                                  variant="soft"
                                  color="danger"
                                  onClick={() => {
                                    setProdutoSelecionado(p);
                                    setOpenConfirmDelete(true);
                                  }}
                                >
                                  <DeleteOutline fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Sheet>

              {data.totalPaginas > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
                  <PaginationJoy
                    page={page}
                    totalPages={data.totalPaginas}
                    onChange={(p: number) => setPage(p)}
                  />
                </Box>
              )}
            </>
          )}
        </Stack>
      </Container>

      <ModalCriarProduto
        open={modalOpenCriar}
        onClose={() => setModalOpenCriar(false)}
        onSaved={() => fetchProdutos(page)}
      />

      <ModalEditarProduto
        open={modalOpenEditar}
        onClose={() => setModalOpenEditar(false)}
        idProduto={produtoEdit?.id ?? ""}
        onSaved={() => fetchProdutos(page)}
      />

      <ConfirmModal
        open={openConfirmDelete}
        title="Excluir produto"
        message={`Tem certeza que deseja excluir "${produtoSelecionado?.nomeProduto}"? Esta ação não pode ser desfeita.`}
        onCancel={() => setOpenConfirmDelete(false)}
        onConfirm={() =>
          produtoSelecionado && deletarProduto(produtoSelecionado.id)
        }
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        color={snackbar.color}
        variant="soft"
      >
        {snackbar.msg}
      </Snackbar>

      <ConfirmModal
        open={openConfirmToggle}
        title={
          produtoSelecionado?.disponivel ? "Desativar produto" : "Ativar produto"
        }
        message={
          produtoSelecionado?.disponivel
            ? `O produto "${produtoSelecionado?.nomeProduto}" deixará de aparecer como disponível na loja.`
            : `O produto "${produtoSelecionado?.nomeProduto}" voltará a ficar disponível na loja.`
        }
        onCancel={() => {
          setOpenConfirmToggle(false);
          setProdutoSelecionado(null);
        }}
        onConfirm={() =>
          produtoSelecionado && alternarDisponibilidade(produtoSelecionado)
        }
      />
    </>
  );
}
