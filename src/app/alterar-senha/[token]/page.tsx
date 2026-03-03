"use client";

import { UserService } from "@/services/user/user.service";
import {
  Box,
  Button,
  Card,
  Container,
  FormLabel,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AlterarSenhaPage() {
  const [senha, setSenha] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");
  const [senhaValida, setSenhaValida] = useState(false);
  const [senhaConfirmValida, setSenhaConfirmValida] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const { token } = useParams<{ token: string }>();
  const [tokenState, setTokenState] = useState<string | null>(null);

  const userService = new UserService();

  useEffect(() => {
    if (token) {
      setTokenState(token)
      console.log(token)
    } else {
      alert('Token de recuperação de senha não encontrado.')
    }
  }, [token])

  const alterarSenha = async () => {
    try {
      await userService.AlterarSenha(senha, token).then((result) => {
        if (result) {
          alert("Senha alterada com sucesso!");
          setSucesso(true);
        } else {
          alert("Falha ao alterar senha.");
        }
      });
    } catch (error) {
      alert("Erro ao alterar senha: " + error);
    }
  };

  function validarSenha(senha: string): boolean {
    const temTamanhoMinimo = senha.length >= 6;
    const temMaiuscula = /[A-Z]/.test(senha);
    const temEspecial = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/]/.test(senha);

    return temTamanhoMinimo && temMaiuscula && temEspecial;
  }

  return (
    !sucesso ? (
      <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        gap: 2,
        py: 4,
      }}
    >
      <Card
        sx={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 4,
        }}
      >
        <Box>
          <Typography sx={{ mb: 2 }}>Criar nova conta</Typography>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alterarSenha();
            }}
          >
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

            <FormLabel sx={{ color: "#fff", mb: 1 }}>Confirmar Senha</FormLabel>
            <Stack
              spacing={0.5}
              sx={{
                "--hue": Math.min(senhaConfirm.length * 10, 120),
                mb: 3,
              }}
            >
              <Input
                type="password"
                placeholder="Confirmar senha"
                value={senhaConfirm}
                onChange={(e) => {
                  const valor = e.target.value;
                  setSenhaConfirm(valor);
                  setSenhaConfirmValida(validarSenha(valor) && valor === senha);
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
                type="submit"
                disabled={!(senhaValida && senhaConfirmValida)}
              >
                Alterar Senha
              </Button>
            </Box>
          </form>
        </Box>
      </Card>
    </Container>    
    ) : (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          gap: 2,
          py: 4,
        }}
      >
        <Card
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography sx={{ mb: 2 }}>Senha alterada com sucesso!</Typography>
          <Button
            fullWidth
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Voltar para Login
          </Button>
        </Card>
      </Container>
    )  
  ) 
}
