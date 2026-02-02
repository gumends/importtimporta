"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalDialog,
  Typography,
  Button,
  FormControl,
  FormLabel,
  Input,
  Grid,
  Box,
} from "@mui/joy";
import Alerta from "./Alerta";
import { UserService } from "@/services/user/user.service";

interface Props {
  open: boolean;
  onClose: () => void;
  emailUser: string;
  onSaved: () => void;
}

export default function ModalEditarUsuario({
  open,
  onClose,
  emailUser,
  onSaved,
}: Props) {
  const userService = new UserService();

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [alertaAberto, setAlertaAberto] = useState(false);
  const [alertaMensagem, setAlertaMensagem] = useState("");
  const [alertaTipo, setAlertaTipo] = useState<TipoAlerta>("neutral");

  const alertar = (msg: string, tipo: TipoAlerta) => {
    setAlertaMensagem(msg);
    setAlertaTipo(tipo);
    setAlertaAberto(true);
  };

  const carregarUsuario = async () => {
    try {
      const data = await userService.BuscaUsuario(emailUser);
      console.log(emailUser);
      console.log(data);
      
      setId(data.id);
      setName(data.name);
      setEmail(data.email);
      setNascimento(data.nascimento);
      setSenha("");
    } catch (error) {
      alertar("Falha ao carregar usuário.", "danger");
    }
  };
  useEffect(() => {
    if (open) carregarUsuario();
  }, [open, emailUser]);

  const salvar = async () => {
    try {
      setIsLoading(true);
      await userService.updateUser(id, name, email, senha, nascimento);

      alertar("Usuário atualizado com sucesso!", "success");
      setIsLoading(false);
      onSaved();
      onClose();
    } catch (err) {
      alertar("Erro ao atualizar usuário.", "danger");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <ModalDialog
          sx={{
            width: 500,
            background: "#111",
            borderRadius: "12px",
            p: 3,
          }}
        >
          <Typography level="h4" sx={{ mb: 2 }}>
            Editar Usuário
          </Typography>

          <Grid container spacing={2}>
            <Grid xs={12}>
              <FormControl>
                <FormLabel>Nome *</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
            </Grid>

            <Grid xs={12}>
              <FormControl>
                <FormLabel>Email *</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
            </Grid>

            <Grid xs={12}>
              <FormControl>
                <FormLabel>Data de Nascimento *</FormLabel>
                <Input
                  type="date"
                  value={nascimento}
                  onChange={(e) => setNascimento(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
          >
            <Button variant="outlined" color="neutral" onClick={onClose}>
              Cancelar
            </Button>

            {isLoading ? (
              <Button sx={{ width: 90 }} loading variant="solid">
                Solid
              </Button>
            ) : (
              <Button variant="solid" color="primary" onClick={salvar}>
                Salvar Alterações
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
