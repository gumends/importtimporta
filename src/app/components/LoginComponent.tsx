import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import {
  Box,
  Button,
  FormLabel,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { Google } from "@mui/icons-material";
import { GoogleAuthService } from "@/services/auth/auth.servcie";
import { UserService } from "@/services/auth/user.service";
import Alerta from "./Alerta";

export default function LoginComponent({
    openModal,
    onClose,
  }: {
    openModal: boolean;
    onClose: () => void;
  }) {

  const [open, setOpen] = React.useState(false);
  const [alertaAberto, setAlertaAberto] = React.useState(false);
  const [alertaMensagem, setAlertaMensagem] = React.useState("");
  const [alertaTipo, setAlertaTipo] = React.useState<
    "success" | "danger" | "warning" | "primary" | "neutral"
  >("neutral");
  const [TempoAlerta, setTempoAlerta] = React.useState<number | undefined>(
    3000
  );

  const mostrarAlerta = (msg: string, tipo: TipoAlerta, tempo?: number) => {
    setAlertaMensagem(msg);
    setAlertaTipo(tipo);
    setAlertaAberto(true);
    setTempoAlerta(tempo);
  };

  React.useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  const [cadastroUsuario, setCadastroUsuario] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [senhaConfirm, setSenhaConfirm] = React.useState("");

  const [nome, setNome] = React.useState("");
  const [nascimento, setNascimento] = React.useState("");
  const googleAuth = new GoogleAuthService();
  const userService = new UserService();

  const [senhaValida, setSenhaValida] = React.useState(false);
  const [senhaConfirmValida, setSenhaConfirmValida] = React.useState(false);

  React.useEffect(() => {
    if (senhaConfirm.length > 0) {
      setSenhaConfirmValida(
        validarSenha(senhaConfirm) && senhaConfirm === senha
      );
    }
  }, [senha, senhaConfirm]);

  function validarSenha(senha: string): boolean {
    const temTamanhoMinimo = senha.length >= 6;
    const temMaiuscula = /[A-Z]/.test(senha);
    const temEspecial = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/]/.test(senha);

    return temTamanhoMinimo && temMaiuscula && temEspecial;
  }

  async function handleGoogleLogin() {
    const currentUrl = window.location.origin;
    const url = await googleAuth.getGoogleLoginUrl(currentUrl);

    const popup = window.open(url, "googleLogin", "width=500,height=600");

    const listener = (event: MessageEvent) => {
      if (event.origin !== process.env.NEXT_PUBLIC_API_URL) return;

      const { token } = event.data;

      if (token) {
        sessionStorage.setItem("auth_token", token);
        window.removeEventListener("message", listener);
        popup?.close();
        window.location.reload();
      }
    };

    window.addEventListener("message", listener);
  }

  const entrar = async () => {
    try {
      await googleAuth.login(email, senha);
      setOpen(false);
      window.location.reload();
    } catch (err: unknown) {
      if (err instanceof Error) {
        mostrarAlerta(err.message, "danger", 9000);
      } else {
        mostrarAlerta("Erro ao fazer login", "danger", 9000);
      }
    }
  };

  const cadastrar = async () => {
    try {
      await userService.createUser(nome, email, senha, nascimento);
      window.location.reload();
    } catch (err: unknown) {
      if (err instanceof Error) {
        mostrarAlerta(err.message, "danger", 9000);
      } else {
        mostrarAlerta("Erro ao fazer login", "danger", 9000);
      }
    }
  };

  React.useEffect(() => {
    if (open) {
      setSenha("");
      setNome("");
      setNascimento("");
    }
  }, [open]);

  return (
    <>
      <React.Fragment>
        <Modal open={openModal} onClose={onClose}>
          <ModalDialog sx={{ width: 700 }}>
            {cadastroUsuario === false && (
              <Box mt={2}>
                <Typography>Acesse sua conta</Typography>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    entrar();
                  }}
                >
                  <FormLabel sx={{ color: "#fff" }}>Email</FormLabel>
                  <Input
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="Digite seu Email"
                    sx={{ mb: 2 }}
                  />

                  <FormLabel sx={{ color: "#fff" }}>Senha</FormLabel>
                  <Input
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />

                  <Button sx={{ mt: 3 }} type="submit" fullWidth>
                    Entrar
                  </Button>
                </form>
              </Box>
            )}

            {cadastroUsuario === true && (
              <Box mt={2}>
                <Typography sx={{ mb: 2 }}>Criar nova conta</Typography>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    cadastrar();
                  }}
                >
                  <FormLabel sx={{ color: "#fff", mb: 1 }}>
                    Nome completo
                  </FormLabel>
                  <Input
                    placeholder="Seu nome"
                    sx={{ mb: 2 }}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />

                  <FormLabel sx={{ color: "#fff", mb: 1 }}>
                    Data de nascimento
                  </FormLabel>
                  <Input
                    type="date"
                    sx={{ mb: 2 }}
                    value={nascimento}
                    onChange={(e) => setNascimento(e.target.value)}
                  />

                  <FormLabel sx={{ color: "#fff", mb: 1 }}>Email</FormLabel>
                  <Input
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="Digite seu Email"
                    sx={{ mb: 2 }}
                  />

                  <FormLabel sx={{ color: "#fff", mb: 1 }}>Senha</FormLabel>
                  <Stack
                    spacing={0.5}
                    sx={{ "--hue": Math.min(senha.length * 10, 120), mb: 2 }}
                  >
                    <Input
                      type="password"
                      placeholder="Digite sua senha"
                      value={senha}
                      onChange={(e) => {
                        const valor = e.target.value;
                        setSenha(valor);
                        setSenhaValida(validarSenha(valor));
                      }}
                    />

                    <Typography
                      level="body-sm"
                      sx={{ color: senhaValida ? "green" : "red", mt: 1 }}
                    >
                      {senha.length === 0
                        ? ""
                        : senhaValida
                        ? "Senha válida"
                        : "A senha deve ter pelo menos 6 caracteres, 1 maiúscula e 1 caractere especial"}
                    </Typography>
                  </Stack>

                  <FormLabel sx={{ color: "#fff", mb: 1 }}>
                    Confirmar Senha
                  </FormLabel>
                  <Stack
                    spacing={0.5}
                    sx={{
                      "--hue": Math.min(senhaConfirm.length * 10, 120),
                      mb: 5,
                    }}
                  >
                    <Input
                      type="password"
                      placeholder="Confirmar senha"
                      value={senhaConfirm}
                      onChange={(e) => {
                        const valor = e.target.value;
                        setSenhaConfirm(valor);
                        setSenhaConfirmValida(
                          validarSenha(valor) && valor === senha
                        );
                      }}
                    />

                    <Typography
                      level="body-sm"
                      sx={{
                        color: senhaConfirmValida ? "green" : "red",
                        mt: 1,
                      }}
                    >
                      {senhaConfirm.length === 0
                        ? ""
                        : senhaConfirmValida
                        ? "Senhas coincidem e são válidas"
                        : "As senhas não coincidem ou não atendem os requisitos"}
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ mr: 2 }}
                      onClick={() => setCadastroUsuario(false)}
                    >
                      Voltar ao login
                    </Button>
                    <Button
                      fullWidth
                      type="submit"
                      disabled={!(senhaValida && senhaConfirmValida)}
                    >
                      Criar conta
                    </Button>
                  </Box>
                </form>
              </Box>
            )}
            {!cadastroUsuario && (
              <Box>
                <Box>
                  <Typography
                    sx={{
                      textAlign: "end",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => setCadastroUsuario(true)}
                  >
                    Não tem uma conta? Cadastre-se agora.
                  </Typography>
                </Box>
                <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleGoogleLogin}
                    fullWidth
                  >
                    <Google sx={{ mr: 1 }} /> Entrar com Google
                  </Button>
                </Box>
              </Box>
            )}
          </ModalDialog>
        </Modal>
      </React.Fragment>
      <Alerta
        mensagem={alertaMensagem}
        tipo={alertaTipo}
        aberto={alertaAberto}
        aoFechar={() => setAlertaAberto(false)}
        tempo={TempoAlerta}
      />
    </>
  );
}