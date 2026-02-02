"use client";

import {
  Modal,
  ModalDialog,
  Typography,
  Stack,
  Input,
  Button,
} from "@mui/joy";
import { useState } from "react";
import { UserService } from "@/services/user/user.service";
import { CepService } from "@/services/cep/cep.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function ModalCriarEndereco({
  open,
  onClose,
  onSaved,
}: Props) {
  const userService = new UserService();
  const cepService = new CepService();

  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState<number | "">("");
  const [complemento, setComplemento] = useState("");
  const [loading, setLoading] = useState(false);

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepInvalido, setCepInvalido] = useState(false);

  const maskCep = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");
    return onlyNumbers
      .slice(0, 8)
      .replace(/^(\d{5})(\d)/, "$1-$2");
  };

  const buscarCep = async (cepFormatado: string) => {
    const cepLimpo = cepFormatado.replace(/\D/g, "");

    setCepInvalido(false);
    setRua("");

    if (cepLimpo.length !== 8) return;

    try {
      setBuscandoCep(true);
      const data = await cepService.getCep(cepLimpo);

      if (data?.erro || !data?.logradouro) {
        setCepInvalido(true);
        return;
      }

      setRua(data.logradouro);
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
      setCepInvalido(true);
    } finally {
      setBuscandoCep(false);
    }
  };

  const salvar = async () => {
    if (cepInvalido || rua.trim() === "") return;

    try {
      setLoading(true);

      await userService.CriarEndereco({
        cep: Number(cep.replace("-", "")),
        logradouro: rua,
        numero: Number(numero),
        complemento,
      });

      onSaved();
      onClose();

      setCep("");
      setRua("");
      setNumero("");
      setComplemento("");
      setCepInvalido(false);
    } catch (err) {
      console.error("Erro ao criar endereço", err);
    } finally {
      setLoading(false);
    }
  };

  const podeSalvar =
    !loading &&
    !buscandoCep &&
    !cepInvalido &&
    cep.replace(/\D/g, "").length === 8 &&
    rua.trim() !== "" &&
    numero !== "";

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="outlined"
        sx={{ bgcolor: "#111", borderColor: "#1f1f1f", width: 420 }}
      >
        <Typography level="h4" mb={2}>
          Novo Endereço
        </Typography>

        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography level="body-sm">CEP</Typography>
            <Input
              placeholder="00000-000"
              inputMode="numeric"
              value={cep}
              error={cepInvalido}
              onChange={(e) => {
                const value = maskCep(e.target.value);
                setCep(value);
                buscarCep(value);
              }}
            />
            {cepInvalido && (
              <Typography level="body-xs" color="danger">
                CEP não encontrado
              </Typography>
            )}
          </Stack>

          <Stack spacing={0.5}>
            <Typography level="body-sm">Rua</Typography>
            <Input
              placeholder={
                buscandoCep ? "Carregando endereço..." : "Nome da rua"
              }
              value={rua}
              disabled={buscandoCep}
              onChange={(e) => setRua(e.target.value)}
            />
          </Stack>

          <Stack spacing={0.5}>
            <Typography level="body-sm">Número</Typography>
            <Input
              placeholder="Número da residência"
              inputMode="numeric"
              value={numero}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setNumero(onlyNumbers === "" ? "" : Number(onlyNumbers));
              }}
            />
          </Stack>

          <Stack spacing={0.5}>
            <Typography level="body-sm">Complemento</Typography>
            <Input
              placeholder="Apto, bloco, referência (opcional)"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="flex-end" mt={1}>
            <Button variant="outlined" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="solid"
              loading={loading}
              disabled={!podeSalvar}
              onClick={salvar}
            >
              Salvar
            </Button>
          </Stack>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
