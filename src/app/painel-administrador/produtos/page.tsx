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
  Alert,
  Tooltip,
} from "@mui/joy";
import { ProdutosResponse, Produto } from "@/types/ProdutoNovo.type";
import { PaginationJoy } from "@/app/components/PaginationJoy";
import ProdutoModal from "@/app/components/ModalCriarProduto";
import { ProdutoService } from "@/services/auth/produto.service";
import { Plus } from "lucide-react";
import { Delete, Edit } from "@mui/icons-material";
import ConfirmModal from "@/app/components/ConfirmModal";
import ModalCriarProduto from "@/app/components/ModalCriarProduto";
import ModalEditarProduto from "@/app/components/ModalEdicaoProduto";
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export default function ProdutosPage() {
  const [data, setData] = useState<ProdutosResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpenCriar, setModalOpenCriar] = useState(false);
  const [modalOpenEditar, setModalOpenEditar] = useState(false);
  const [produtoEdit, setProdutoEdit] = useState<Produto | null>(null);
  const produtoService = new ProdutoService();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmDesativar, setOpenConfirmDesativar] = useState(false);
  const [idProdutoToDelete, setIdProdutoToDelete] = useState<number>(0);

  const tipos_produtos = {
    1: "Iphones",
    2: "Macs",
    3: "Acessórios",
    4: "Outros",
  };

  const fetchProdutos = async (pagina: number) => {
    try {
      setLoading(true);
      const res = await produtoService.getProdutos(pagina);
      console.log(res);
      setData(res);
    } catch (err) {
      console.error("Erro ao carregar produtos", err);
    } finally {
      setLoading(false);
    }
  };
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const deletarProduto = async (id: number) => {
    await fetch(`${apiUrl}/produto/${id}`, { method: "DELETE" });
    setOpenConfirm(false);
    fetchProdutos(page);
  };

  const desativarProduto = async (id: number) => {
    await fetch(`${apiUrl}/produto/ativa_desativa/${id}`, { method: "PUT" });
    setOpenConfirmDesativar(false);
    fetchProdutos(page);
  };

  useEffect(() => {
    fetchProdutos(page);
  }, [page]);

  return (
    <>
      <Box
        sx={{
          color: "#fff",
          minHeight: "100vh",
          py: 6,
          px: { xs: 2, md: 6 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <Typography
            level="h2"
            sx={{
              mb: 4,
              color: "#fff",
            }}
          >
            Lista de Produtos
          </Typography>
          <IconButton
            variant="plain"
            onClick={() => {
              setProdutoEdit(null);
              setModalOpenCriar(true);
            }}
          >
            <Plus style={{ width: 40, height: 40 }} />
          </IconButton>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress size="lg" />
          </Box>
        )}

        {!loading && data && (
          <>
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: "md",
                overflow: "hidden",
                p: 2,
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <Table borderAxis="bothBetween" stripe="even">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Valor</th>
                    <th>Disponível</th>
                    <th>Tipo</th>
                    <th>Cor</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {data.itens.map((p: Produto) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nomeProduto}</td>
                      <td>R$ {p.valor?.toFixed(2)}</td>

                      <td>
                        <Chip
                          variant="soft"
                          color={p.disponivel ? "success" : "danger"}
                        >
                          {p.disponivel ? "Sim" : "Não"}
                        </Chip>
                      </td>

                      <td>
                        <Chip variant="plain" color="neutral">
                          {
                            tipos_produtos[
                              p.tipoProduto as keyof typeof tipos_produtos
                            ]
                          }
                        </Chip>
                      </td>

                      <td>
                        <Chip
                          sx={{
                            backgroundColor: "transparent",
                            color: "#fff",
                            borderColor: p.color,
                            borderWidth: 3,
                            borderStyle: "solid",
                          }}
                        >
                          {p.colorName}
                        </Chip>
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <IconButton
                          size="sm"
                          onClick={() => {
                            setProdutoEdit(p);
                            setModalOpenEditar(true);
                          }}
                        >
                          <Edit color="warning" style={{ width: 25, height: 25 }} />
                        </IconButton>
                        <IconButton
                          size="sm"
                          onClick={() => {
                            setIdProdutoToDelete(p.id);
                            setOpenConfirm(true);
                          }}
                        >
                          <Delete style={{ color: "red", width: 25, height: 25 }} />
                        </IconButton>
                        <IconButton
                          size="sm"
                          onClick={() => {
                            setIdProdutoToDelete(p.id);
                            setOpenConfirmDesativar(true);
                          }}
                        >
                          {
                            p.disponivel ? 
                            <Tooltip title="Desativar Produto"><LockOutlineIcon style={{ color: "red", width: 25, height: 25 }} /></Tooltip>
                             : 
                            <Tooltip title="Ativar Produto"><LockOpenIcon style={{ color: "green", width: 25, height: 25 }} /></Tooltip>
                          }
                          
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <PaginationJoy
                page={page}
                totalPages={data.totalPaginas}
                onChange={(p: number) => setPage(p)}
              />
            </Box>
          </>
        )}
      </Box>
      <ModalCriarProduto
        open={modalOpenCriar}
        onClose={() => setModalOpenCriar(false)}
        onSaved={() => fetchProdutos(page)}
      />
      <ModalEditarProduto
        open={modalOpenEditar}
        onClose={() => setModalOpenEditar(false)}
        idProduto={produtoEdit?.id ?? 0}
        onSaved={() => fetchProdutos(page)}
      />
      <ConfirmModal
        open={openConfirm}
        title="Deletar Produto"
        message="Tem certeza que deseja deletar este produto? Essa ação não pode ser desfeita."
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => deletarProduto(idProdutoToDelete)}
      />
      <ConfirmModal
        open={openConfirmDesativar}
        title="Desativar Produto"
        message="Tem certeza que deseja desativar este produto?"
        onCancel={() => setOpenConfirmDesativar(false)}
        onConfirm={() => desativarProduto(idProdutoToDelete)}
      />
    </>
  );
}
