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

interface UsuariosResponse {
  itens: Usuario[];
  totalPaginas: number;
}
import { PaginationJoy } from "@/app/components/PaginationJoy";
import ConfirmModal from "@/app/components/ConfirmModal";
import { UserService } from "@/services/user/user.service";
import { Usuario } from "@/types/usuario.type";
import PanToolIcon from "@mui/icons-material/PanTool";
import DoNotTouchIcon from "@mui/icons-material/DoNotTouch";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

export default function UsuariosPage() {
  const [data, setData] = useState<UsuariosResponse | null>(null);
  const [pagina, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
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
                          TipoAcesso.find((t) => t.tipo == u.acesso)
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
                            <Tooltip title={u.role == "1" ? "Regredir Permissão" : "Promover"} variant="solid">
                              {u.role == "2" ? (
                                <ArrowCircleUpIcon
                                  color="primary"
                                  style={{ width: 25, height: 25 }}
                                />
                              ) : (
                                <ArrowCircleDownIcon
                                  color="warning"
                                  style={{ width: 25, height: 25 }}
                                />
                              )}
                            </Tooltip>
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
