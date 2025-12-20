"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  Sheet,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/joy";
import { Produto } from "@/types/ProdutoNovo.type";

interface UsuariosResponse {
  itens: Usuario[];
  totalPaginas: number;
}
import { PaginationJoy } from "@/app/components/PaginationJoy";
import { Plus } from "lucide-react";
import ConfirmModal from "@/app/components/ConfirmModal";
import { UserService } from "@/services/auth/user.service";
import { Usuario } from "@/types/usuario.type";
import { Delete, Edit } from "@mui/icons-material";
import PanToolIcon from "@mui/icons-material/PanTool";
import DoNotTouchIcon from "@mui/icons-material/DoNotTouch";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

export default function UsuariosPage() {
  const [data, setData] = useState<UsuariosResponse | null>(null);
  const [pagina, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpenCriar, setModalOpenCriar] = useState(false);
  const [produtoEdit, setProdutoEdit] = useState<Produto | null>(null);
  const userService = new UserService();
  const [openConfirmStatus, setOpenConfirmStatus] = useState(false);
  const [openConfirmAcesso, setOpenConfirmAcesso] = useState(false);
  const [idUsuario, setIdUsuario] = useState<number>(0);

  const fetchUsuarios = async (pagina: number) => {
    try {
      setLoading(true);
      const res = await userService.getAllUser(pagina, 8);
      setData(res);
    } catch (err) {
      console.error("Erro ao carregar produtos", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatusUsuario = async (id: number) => {
    try {
      await userService.toggleUserStatus(id);
    } catch (err) {
      console.error("Erro ao alterar status do usuário", err);
    } finally {
      setOpenConfirmStatus(false);
      fetchUsuarios(pagina);
    }
  };

  const toggleStatusAcesso = async (id: number) => {
    try {
      await userService.toggleUserAccess(id);
    } catch (err) {
      console.error("Erro ao alterar status do usuário", err);
    } finally {
      setOpenConfirmAcesso(false);
      fetchUsuarios(pagina);
    }
  };

  const TipoUsuario = [
    { tipo: 1, nome: "Admin" },
    { tipo: 2, nome: "Usuario" },
  ];

  const TipoAcesso = [
    { tipo: 1, nome: "Google" },
    { tipo: 2, nome: "Apple" },
    { tipo: 3, nome: "Padrão" },
  ];

  useEffect(() => {
    fetchUsuarios(pagina);
  }, [pagina]);

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
            Lista de Usuarios
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
                    <th>nascimento</th>
                    <th>Acesso</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {data.itens.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.nascimento}</td>
                      <td>
                        {
                          TipoAcesso.find((t) => t.tipo.toString() == u.acesso)
                            ?.nome
                        }
                      </td>
                      <td>
                        {
                          TipoUsuario.find((t) => t.tipo.toString() == u.role)
                            ?.nome
                        }
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
                            setIdUsuario(u.id);
                            setOpenConfirmAcesso(true);
                          }}
                        >
                          {u.role == "2" ? (
                            <ArrowCircleDownIcon
                              color="warning"
                              style={{ width: 25, height: 25 }}
                            />
                          ) : (
                            <ArrowCircleUpIcon
                              color="primary"
                              style={{ width: 25, height: 25 }}
                            />
                          )}
                        </IconButton>
                        <IconButton
                          size="sm"
                          onClick={() => {
                            setIdUsuario(u.id);
                            setOpenConfirmStatus(true);
                          }}
                        >
                          {u.status ? (
                            <PanToolIcon color="warning"
                              style={{ width: 25, height: 25 }}
                            />
                          ) : (
                            <DoNotTouchIcon
                              style={{ color: "red", width: 25, height: 25 }}
                            />
                          )}
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <PaginationJoy
                page={pagina}
                totalPages={data.totalPaginas}
                onChange={(p: number) => setPage(p)}
              />
            </Box>
          </>
        )}
      </Box>
      <ConfirmModal
        open={openConfirmStatus}
        title="Desativar Usuário"
        message="Tem certeza que deseja desativar este usuário? Essa ação não pode ser desfeita."
        onCancel={() => setOpenConfirmStatus(false)}
        onConfirm={() => toggleStatusUsuario(idUsuario)}
      />

      <ConfirmModal
        open={openConfirmAcesso}
        title="Acesso Usuário"
        message="Tem certeza que deseja desativar este usuário? Essa ação não pode ser desfeita."
        onCancel={() => setOpenConfirmAcesso(false)}
        onConfirm={() => toggleStatusAcesso(idUsuario)}
      />
    </>
  );
}
