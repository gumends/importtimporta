"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  Divider,
  Chip,
  IconButton,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import { GoogleAuthService } from "@/services/auth/auth.service";
import { Usuario } from "@/types/usuario.type";
import ModalEditarUsuario from "../components/ModalEditarUsuario";
import { UserService } from "@/services/user/user.service";
import { Add, Delete, DeleteForever, Edit } from "@mui/icons-material";
import { Endereco } from "@/types/Endereco.type";
import ConfirmModal from "../components/ConfirmModal";
import { set } from "lodash";

export default function ProfilePage() {
  const router = useRouter();
  const googleAuth = new GoogleAuthService();
  const userService = new UserService();

  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [editarOpen, setEditarOpen] = useState(false);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [openConfirmExcluirEndereco, setOpenConfirmExcluirEndereco] = useState(false);
  const [idEndereco, setIdEndereco] = useState<number>(0);

  function getInitials(name: string) {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  const buscaEnderecos = async () => {
    try {
      const enderecos = await userService.BuscaEnderecosUsuario();
      setEnderecos(enderecos);
      console.log(enderecos);
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
    }
  }

  const excluirEndereco = async (id: number) => {
    try {
      await userService.ExcluirEndereco(id);
      setOpenConfirmExcluirEndereco(false);
      buscaEnderecos();
    } catch (error) {
      console.error("Erro ao excluir endereço:", error);
    }
  }

  const carregarUsuario = async () => {
    try {
      const dados = await googleAuth.me();
      setUser(dados);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuario();
    buscaEnderecos();
  }, []);

  const logout = async () => {
    await googleAuth.logout().then(() => {
      router.push("/");
    });
  };

  return (
    <>
      <Box
        sx={{
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pt: 4,
        }}
      >
        <Box sx={{ width: "70vw" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 4,
            }}
          >
            <Box>
              <Typography level="h2" sx={{ fontWeight: 600 }}>
                Meu Perfil
              </Typography>
              <Typography level="body-sm" sx={{ opacity: 0.6 }}>
                Dados da sua conta Import Importa
              </Typography>
            </Box>

            <Button
              variant="outlined"
              color="neutral"
              onClick={() => router.push("/")}
            >
              Voltar
            </Button>
          </Box>

          <Card
            variant="outlined"
            sx={{
              bgcolor: "#111",
              borderColor: "#1f1f1f",
              borderRadius: "xl",
              mb: 4,
            }}
          >
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={3}
                alignItems={{ xs: "flex-start", md: "center" }}
              >
                <Avatar
                  sx={{
                    "--Avatar-size": "72px",
                    bgcolor: "#fff",
                    color: "#000",
                    fontWeight: 700,
                    fontSize: "1.7rem",
                  }}
                >
                  {user ? getInitials(user.name) : "?"}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography level="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {loading
                      ? "Carregando..."
                      : user?.name ?? "Não autenticado"}
                  </Typography>

                  <Typography level="body-md" sx={{ opacity: 0.7 }}>
                    {user?.email}
                  </Typography>

                  {user && (
                    <Chip
                      size="sm"
                      variant="soft"
                      color="success"
                      sx={{ mt: 1 }}
                    >
                      {user.acesso === 3 ? "Conta conectada Normal" : "Conta conectada com Google"}
                    </Chip>
                  )}
                </Box>

                <Stack spacing={1} width={{ xs: "100%", md: "auto" }}>
                  <Button
                    variant="solid"
                    sx={{
                      bgcolor: "#fff",
                      color: "#000",
                      fontWeight: "bold",
                      "&:hover": { bgcolor: "#eaeaea" },
                    }}
                    onClick={() => setEditarOpen(true)}
                  >
                    Editar Perfil
                  </Button>

                  <Button
                    variant="outlined"
                    color="danger"
                    onClick={logout}
                    sx={{ textTransform: "none" }}
                  >
                    Sair
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ my: 3 }} />
              <Box>
                <Typography level="body-md" sx={{ fontWeight: 500 }}>
                  Informações da Conta
                </Typography>

                                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={3}
                  mt={2}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography level="body-xs" sx={{ opacity: 0.5 }}>
                      Nome
                    </Typography>
                    <Typography>{user?.name ?? "-"}</Typography>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography level="body-xs" sx={{ opacity: 0.5 }}>
                      Email
                    </Typography>
                    <Typography>{user?.email ?? "-"}</Typography>
                  </Box>
                </Stack>


                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
                  <Typography level="body-md" sx={{ fontWeight: 500 }}>
                    Endereços
                  </Typography>
                  <IconButton onClick={() => {}} size="md" variant="outlined" sx={{ pr: 2 }}>
                    <Add sx={{ mr: 2 }}/> Novo Endereço
                  </IconButton>
                </Box>
                {
                  enderecos && enderecos.length > 0 ? enderecos.map((endereco) => (
                  <Box
                    key={endereco.id}
                    sx={{ border: "1px solid #333", borderRadius: "md", p: 2, mt: 2 }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", gap: 1, mb: 1 }}>
                      <IconButton color="warning" onClick={() => {}} size="sm"><Edit/></IconButton>
                      <IconButton color="danger" onClick={() => {setIdEndereco(endereco.id); setOpenConfirmExcluirEndereco(true);}} size="sm"><DeleteForever/></IconButton>
                    </Box>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={3}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography level="body-xs" sx={{ opacity: 0.5 }}>
                          CEP
                        </Typography>
                        <Typography level="body-md" >{endereco?.cep ?? "-"}</Typography>
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography level="body-xs" sx={{ opacity: 0.5 }}>
                          Numero
                        </Typography>
                        <Typography level="body-md" >{endereco?.numero ?? "-"}</Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography level="body-xs" sx={{ opacity: 0.5 }}>
                          Complemento
                        </Typography>
                        <Typography level="body-md" >{endereco?.complemento ?? "-"}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                  )) : (
                    <Box sx={{ textAlign: "center", mt: 3, mb: 2 }}>
                      <Typography level="body-lg">Nenhum endereço cadastrado</Typography>
                      <Typography level="body-sm" sx={{ mt: 1 }}>Para realizar uma compra, adicione um endereço de entrega.</Typography>
                    </Box>
                  )
                }
              </Box>
            </CardContent>
          </Card>

          <Card
            variant="outlined"
            sx={{
              bgcolor: "#111",
              borderColor: "#1f1f1f",
              borderRadius: "xl",
            }}
          >
            <CardContent>
              <Typography level="title-md" sx={{ mb: 1 }}>
                Histórico e pedidos (em breve)
              </Typography>
              <Typography level="body-sm" sx={{ opacity: 0.6 }}>
                Em breve você poderá visualizar suas compras e atividades
                recentes.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <ModalEditarUsuario
        open={editarOpen}
        onClose={() => setEditarOpen(false)}
        emailUser={user?.email || ""}
        onSaved={() => {}}
      />
      <ConfirmModal
        open={openConfirmExcluirEndereco}
        title="Excluir Endereço"
        message="Tem certeza que deseja excluir este endereço?"
        onCancel={() => setOpenConfirmExcluirEndereco(false)}
        onConfirm={() => excluirEndereco(idEndereco)}
      />
    </>
  );
}
