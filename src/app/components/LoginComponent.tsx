import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import {
  Box,
  Button,
  Dropdown,
  FormLabel,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/joy";
import { Google, Person, Apple, ExitToApp } from "@mui/icons-material";
import { GoogleAuthService } from "@/services/auth/auth.servcie";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/auth/user.service";
import { MenuResponse } from "@/types/menus.type";
import Alerta from "./Alerta";
import { ResponseError } from "@/types/ResponseError.type";

export default function LoginComponent() {
  const [open, setOpen] = React.useState(false);
  const [logado, setLogado] = React.useState(false);
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

  // Fluxo de login/cadastro
  const [userValid, setUserValid] = React.useState<boolean | null>(null);
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [senhaConfirm, setSenhaConfirm] = React.useState("");

  // Dados do cadastro
  const [nome, setNome] = React.useState("");
  const [nascimento, setNascimento] = React.useState("");
  const [menus, setMenus] = React.useState<MenuResponse>([]);
  const googleAuth = new GoogleAuthService();
  const router = useRouter();
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
    try {
      const currentUrl = window.location.href;
      const url = await googleAuth.getGoogleLoginUrl(currentUrl);
      window.location.href = url;
    } catch (err) {
      console.error("Erro ao iniciar login do Google:", err);
    }
  }

  async function getMenus(email: string) {
    const response: MenuResponse = await userService.GetMenus(email);
    setMenus(response);
  }

  React.useEffect(() => {
    googleAuth.me().then((res) => {
      if (res && res.email) {
        getMenus(res.email);
        setLogado(true);
      }
    });
  }, [logado]);

  const logout = async () => {
    await googleAuth.logout().then(() => router.push("/"));
  };

  const validaUsuario = async () => {
    try {
      const isValid = await userService.validaUsuario(email);
      setUserValid(isValid);
    } catch (err) {
      console.error("Erro ao validar usuário:", err);
    }
  };

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
    const currentUrl = window.location.href;
    if (senhaValida || senhaConfirmValida) {
      const result = await userService.createUser(
        nome,
        email,
        senha,
        nascimento,
        currentUrl
      );

      window.location.href = result.redirect;
    }
  };

  React.useEffect(() => {
    if (open) {
      setUserValid(null);
      setSenha("");
      setNome("");
      setNascimento("");
    }
  }, [open]);

  return (
    <>
      <React.Fragment>
        {!logado ? (
          <IconButton onClick={() => setOpen(true)}>
            <Person />
          </IconButton>
        ) : (
          <Dropdown>
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{ root: { variant: "outlined", color: "neutral" } }}
            >
              <Person />
            </MenuButton>
            <Menu>
              {menus.map((menu) => (
                <MenuItem key={menu.id} onClick={() => router.push(menu.link)}>
                  {menu.name}
                </MenuItem>
              ))}
              <MenuItem color="danger" onClick={logout}>
                Sair <ExitToApp />
              </MenuItem>
            </Menu>
          </Dropdown>
        )}

        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog sx={{ width: 700 }}>
            <Typography>Acesse sua conta</Typography>
            {userValid === null && (
              <Box mt={2}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    validaUsuario();
                  }}
                >
                  <FormLabel sx={{ color: "#fff" }}>Email</FormLabel>
                  <Input
                    placeholder="Digite seu e-mail"
                    sx={{ mb: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <Button type="submit" fullWidth>
                    Continuar
                  </Button>
                </form>
              </Box>
            )}

            {/* ================================
                2) SE USUÁRIO EXISTE → LOGIN
              ================================= */}
            {userValid === true && (
              <Box mt={2}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    entrar();
                  }}
                >
                  <FormLabel sx={{ color: "#fff" }}>Email</FormLabel>
                  <Input value={email} sx={{ mb: 2 }} />

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

            {/* ================================
                3) SE USUÁRIO NÃO EXISTE → CADASTRO
              ================================= */}
            {userValid === false && (
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

                  <Button
                    fullWidth
                    type="submit"
                    disabled={!(senhaValida && senhaConfirmValida)}
                  >
                    Criar conta
                  </Button>
                </form>
              </Box>
            )}

            {/* BOTÕES DE LOGIN SOCIAL */}
            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={handleGoogleLogin} fullWidth>
                <Google sx={{ mr: 1 }} /> Entrar com Google
              </Button>

              <Button
                fullWidth
                variant="solid"
                sx={{ bgcolor: "#fff", color: "#000" }}
              >
                <Apple sx={{ mr: 1 }} /> Entrar com Apple
              </Button>
            </Box>
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
