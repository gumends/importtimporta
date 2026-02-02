"use client";

import {
  Modal,
  ModalDialog,
  Typography,
  Stack,
  Input,
  Button,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { UserService } from "@/services/user/user.service";
import { CepService } from "@/services/cep/cep.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  enderecoId?: number;
}

export default function ModalEndereco({
  open,
  onClose,
  onSaved,
  enderecoId,
}: Props) {
  const userService = new UserService();
  const cepService = new CepService();
  const isEdit = Boolean(enderecoId);

  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState<number | "">("");
  const [complemento, setComplemento] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const maskCep = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");
    return onlyNumbers
      .slice(0, 8)
      .replace(/^(\d{5})(\d)/, "$1-$2");
  };

  useEffect(() => {
    if (!open || !isEdit) return;

    const carregarEndereco = async () => {
      try {
        setLoading(true);
        const endereco = await userService.BuscarEnderecoPorId(enderecoId!);

        setCep(maskCep(String(endereco.cep)));
        setRua(endereco.logradouro);
        setNumero(endereco.numero);
        setComplemento(endereco.complemento ?? "");
      } catch (err) {
        console.error("Erro ao buscar endereço", err);
      } finally {
        setLoading(false);
      }
    };

    carregarEndereco();
  }, [open, isEdit, enderecoId]);

  // 🔹 Buscar CEP automaticamente
  useEffect(() => {
    const buscarCep = async () => {
      const cepNumerico = cep.replace(/\D/g, "");

      if (cepNumerico.length !== 8) {
        setCepError(null);
        return;
      }

      try {
        setLoadingCep(true);
        setCepError(null);

        const data = await cepService.getCep(cepNumerico);

        if (data.erro) {
          setRua("");
          setCepError("CEP não encontrado");
          return;
        }

        setRua(data.logradouro ?? "");
      } catch {
        setCepError("Erro ao buscar CEP");
        setRua("");
      } finally {
        setLoadingCep(false);
      }
    };

    buscarCep();
  }, [cep]);

  const salvar = async () => {
    if (cepError || loadingCep) return;

    try {
      setLoading(true);

      const payload = {
        cep: Number(cep.replace("-", "")),
        logradouro: rua,
        numero: Number(numero),
        complemento,
      };

      if (isEdit) {
        await userService.EditarEndereco(enderecoId!, payload);
      } else {
        await userService.CriarEndereco(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Erro ao salvar endereço", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="outlined"
        sx={{ bgcolor: "#111", borderColor: "#1f1f1f", width: 420 }}
      >
        <Typography level="h4" mb={2}>
          {isEdit ? "Editar Endereço" : "Novo Endereço"}
        </Typography>

        <Stack spacing={2}>
          {/* CEP */}
          <Stack spacing={0.5}>
            <Typography level="body-sm">CEP</Typography>
            <Input
              placeholder="00000-000"
              inputMode="numeric"
              value={cep}
              onChange={(e) => setCep(maskCep(e.target.value))}
              error={Boolean(cepError)}
            />
            {cepError && (
              <Typography level="body-xs" color="danger">
                {cepError}
              </Typography>
            )}
          </Stack>

          {/* Rua */}
          <Stack spacing={0.5}>
            <Typography level="body-sm">Rua</Typography>
            <Input
              value={loadingCep ? "Carregando..." : rua}
              disabled={loadingCep}
            />
          </Stack>

          {/* Número */}
          <Stack spacing={0.5}>
            <Typography level="body-sm">Número</Typography>
            <Input
              inputMode="numeric"
              value={numero}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setNumero(onlyNumbers === "" ? "" : Number(onlyNumbers));
              }}
            />
          </Stack>

          {/* Complemento */}
          <Stack spacing={0.5}>
            <Typography level="body-sm">Complemento</Typography>
            <Input
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
          </Stack>

          {/* Ações */}
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="outlined" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              loading={loading}
              disabled={Boolean(cepError) || loadingCep}
              onClick={salvar}
            >
              {isEdit ? "Salvar Alterações" : "Cadastrar"}
            </Button>
          </Stack>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
