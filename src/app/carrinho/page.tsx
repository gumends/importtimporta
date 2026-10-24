"use client";



import {

  Box,

  Button,

  Card,

  CardContent,

  CircularProgress,

  Container,

  Divider,

  IconButton,

  Input,

  Radio,

  RadioGroup,

  Sheet,

  Typography,

} from "@mui/joy";

import { Plus, Trash2 } from "lucide-react";

import RemoveIcon from "@mui/icons-material/Remove";

import React from "react";

import {

  CARRINHO_ATUALIZADO_EVENT,

  CarrinhoService,

} from "@/services/carrinho/carrinho.service";

import { CarrinhoResponse } from "@/types/carrinhoRespone";

import { formatarDinheiro } from "@/utils/mascara_dinheiro";

import { FreteService } from "@/services/frete/frete.service";

import { CotarFreteResponse, OpcaoFrete } from "@/types/frete";



const freteService = new FreteService();



function maskCep(value: string) {

  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 5) return digits;

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;

}



export default function Carrinho() {

  const [quantidade, setQuantidade] = React.useState(1);

  const [carrinhoData, setCarrinhoData] = React.useState<CarrinhoResponse>();

  const [cep, setCep] = React.useState("");

  const [cotacao, setCotacao] = React.useState<CotarFreteResponse | null>(null);

  const [opcaoFrete, setOpcaoFrete] = React.useState<string>("pac");

  const [loadingFrete, setLoadingFrete] = React.useState(false);

  const [erroFrete, setErroFrete] = React.useState<string | null>(null);



  const service = new CarrinhoService();

  const opcaoFreteRef = React.useRef(opcaoFrete);

  opcaoFreteRef.current = opcaoFrete;



  const buscarCarrinho = React.useCallback(async () => {

    const token = sessionStorage.getItem("auth_token");



    if (!token) {

      setCarrinhoData(CarrinhoService.getCarrinhoLocal());

      return;

    }



    try {

      const data = await service.getCarrinho();

      setCarrinhoData(data);

    } catch (error) {

      console.error("Erro ao buscar carrinho:", error);

    }

  }, []);



  React.useEffect(() => {

    void buscarCarrinho();

    const salvo = FreteService.getFreteSalvo();

    if (salvo?.cep) {

      setCep(maskCep(salvo.cep));

      setOpcaoFrete(salvo.opcaoCodigo);

    }

    const onUpdate = () => {

      void buscarCarrinho();

    };

    window.addEventListener(CARRINHO_ATUALIZADO_EVENT, onUpdate);

    return () => window.removeEventListener(CARRINHO_ATUALIZADO_EVENT, onUpdate);

  }, [buscarCarrinho]);



  const itensParaFrete = React.useMemo(() => {

    if (!carrinhoData?.itens.length) return [];

    return carrinhoData.itens.map((item) => ({

      idProduto: item.idProduto,

      quantidade: item.quantidade,

      valorUnitario: item.valorUnitario,

    }));

  }, [carrinhoData]);



  React.useEffect(() => {

    const cepNumerico = cep.replace(/\D/g, "");

    if (!itensParaFrete.length) {

      setCotacao(null);

      FreteService.limparFrete();

      return;

    }

    if (cepNumerico.length !== 8) {
      if (cepNumerico.length > 0) {
        setErroFrete(null);
        setCotacao(null);
      }
      return;
    }



    const t = window.setTimeout(() => {

      void (async () => {

        setLoadingFrete(true);

        setErroFrete(null);

        try {

          const result = await freteService.cotar(

            cepNumerico,

            itensParaFrete,

            opcaoFreteRef.current,

          );

          setCotacao(result);

          const codigo = result.opcoes.some(

            (o) => o.codigo === opcaoFreteRef.current,

          )

            ? opcaoFreteRef.current

            : (result.opcaoSelecionada ?? result.opcoes[0]?.codigo ?? "pac");

          setOpcaoFrete(codigo);

          const sel =

            result.opcoes.find((o) => o.codigo === codigo) ?? result.opcoes[0];

          if (sel) {

            FreteService.salvarFrete({

              cep: cepNumerico,

              opcaoCodigo: sel.codigo,

              valor: sel.valor,

              prazoMinDias: sel.prazoMinDias,

              prazoMaxDias: sel.prazoMaxDias,

              estimativa: result.estimativa,

            });

          }

        } catch (e) {

          setCotacao(null);

          setErroFrete(

            e instanceof Error ? e.message : "Erro ao calcular frete.",

          );

          FreteService.limparFrete();

        } finally {

          setLoadingFrete(false);

        }

      })();

    }, 400);

    return () => window.clearTimeout(t);

  }, [cep, itensParaFrete]);



  const opcaoAtual: OpcaoFrete | undefined = cotacao?.opcoes.find(

    (o) => o.codigo === opcaoFrete,

  );



  const taxaEntrega = opcaoAtual?.valor ?? 0;

  const subtotal = Number(carrinhoData?.subtotal ?? 0);

  const total = subtotal + taxaEntrega;



  const aoMudarOpcao = (codigo: string) => {

    setOpcaoFrete(codigo);

    const sel = cotacao?.opcoes.find((o) => o.codigo === codigo);

    if (sel && cep.replace(/\D/g, "").length === 8) {

      FreteService.salvarFrete({

        cep: cep.replace(/\D/g, ""),

        opcaoCodigo: sel.codigo,

        valor: sel.valor,

        prazoMinDias: sel.prazoMinDias,

        prazoMaxDias: sel.prazoMaxDias,

        estimativa: cotacao?.estimativa ?? true,

      });

    }

  };



  const deletarItem = async (id: string) => {

    await service.deleteItemCarrinho(id);

    await buscarCarrinho();

  };



  return (

    <Container sx={{ display: "flex", width: "100%", gap: 2, py: 4 }}>

      <Box sx={{ width: "100%" }}>

        {carrinhoData &&

          carrinhoData?.itens.length > 0 &&

          carrinhoData?.itens.map((item, key) => (

            <Card

              onClick={() => {}}

              variant="outlined"

              key={key}

              invertedColors

              sx={{ position: "relative", mb: 2 }}

            >

              <CardContent orientation="horizontal">

                <Box

                  component="img"

                  sx={{

                    height: 150,

                    width: 150,

                    borderRadius: 2,

                    marginRight: 2,

                    objectFit: "cover",

                  }}

                  src={item.imagemUrl}

                  alt={item.nomeProduto}

                />

                <CardContent>

                  <Typography level="body-lg">{item.nomeProduto}</Typography>

                  <Typography level="body-sm">{item.descricao}</Typography>

                  <Typography level="h2">

                    {formatarDinheiro(Number(item.valorUnitario))}

                  </Typography>

                  <Box

                    sx={{

                      display: "flex",

                      alignItems: "center",

                    }}

                  >

                    <IconButton

                      onClick={() =>

                        setQuantidade(quantidade > 1 ? quantidade - 1 : 1)

                      }

                    >

                      <RemoveIcon />

                    </IconButton>

                    <Typography

                      component="span"

                      sx={{ mx: 1, width: 20, textAlign: "center" }}

                    >

                      {item.quantidade}

                    </Typography>

                    <IconButton onClick={() => setQuantidade(quantidade + 1)}>

                      <Plus />

                    </IconButton>

                    <Typography level="body-xs" sx={{ ml: 2 }}>

                      {item.quantidade} disponiveis

                    </Typography>

                  </Box>

                </CardContent>

              </CardContent>

              <IconButton

                onClick={() => {

                  deletarItem(item.id);

                }}

                variant="outlined"

                size="md"

                color="danger"

                sx={{ position: "absolute", top: 8, right: 8, zIndex: 99 }}

              >

                <Trash2 />

              </IconButton>

            </Card>

          ))}

        {carrinhoData?.itens.length === 0 && (

          <Typography level="h4" sx={{ textAlign: "center", mt: 4 }}>

            Seu carrinho está vazio.

          </Typography>

        )}

      </Box>

      <Box sx={{ width: "40%", minWidth: 280 }}>

        <Card sx={{ margin: 0, padding: 0 }}>

          <CardContent sx={{ px: 1.5, pt: 2, pb: 1 }}>

            <Typography level="body-lg">Resumo da compra</Typography>

          </CardContent>

          <Divider />

          <CardContent>

            {(carrinhoData?.itens.length ?? 0) > 0 && (

              <Sheet

                variant="soft"

                sx={{ mx: 1.5, mb: 2, p: 1.5, borderRadius: "sm" }}

              >

                <Typography level="title-sm" sx={{ mb: 1 }}>

                  Calcular entrega

                </Typography>

                <Input

                  placeholder="00000-000"

                  value={cep}

                  onChange={(e) => setCep(maskCep(e.target.value))}

                  slotProps={{ input: { inputMode: "numeric" } }}

                  endDecorator={

                    loadingFrete ? <CircularProgress size="sm" /> : null

                  }

                />

                {!erroFrete &&
                  cep.replace(/\D/g, "").length > 0 &&
                  cep.replace(/\D/g, "").length < 8 && (
                    <Typography level="body-xs" sx={{ mt: 0.5, opacity: 0.85 }}>
                      Falta completar o CEP — use 8 dígitos (ex.: 41651-070).
                    </Typography>
                  )}

                {erroFrete && (

                  <Typography level="body-xs" color="danger" sx={{ mt: 0.5 }}>

                    {erroFrete}

                  </Typography>

                )}

                {cotacao && cotacao.opcoes.length > 0 && (

                  <Box sx={{ mt: 1.5 }}>

                    {cotacao.estimativa && (

                      <Typography

                        level="body-xs"

                        sx={{ mb: 0.5, opacity: 0.75 }}

                      >

                        Valores estimados (Correios). Configure Melhor Envio na

                        API para cotação oficial.

                      </Typography>

                    )}

                    <RadioGroup

                      value={opcaoFrete}

                      onChange={(e) => aoMudarOpcao(e.target.value)}

                    >

                      {cotacao.opcoes.map((op) => (

                        <Radio

                          key={op.codigo}

                          value={op.codigo}

                          label={

                            <Box

                              sx={{

                                display: "flex",

                                justifyContent: "space-between",

                                width: "100%",

                                gap: 1,

                              }}

                            >

                              <Box>

                                <Typography level="body-sm">{op.nome}</Typography>

                                <Typography level="body-xs">

                                  {op.prazoMinDias} a {op.prazoMaxDias} dias

                                  úteis

                                </Typography>

                              </Box>

                              <Typography level="body-sm" fontWeight="lg">

                                {op.valor <= 0

                                  ? "Grátis"

                                  : formatarDinheiro(op.valor)}

                              </Typography>

                            </Box>

                          }

                          sx={{ alignItems: "flex-start", my: 0.5 }}

                        />

                      ))}

                    </RadioGroup>

                  </Box>

                )}

              </Sheet>

            )}

            <Box

              sx={{

                display: "flex",

                justifyContent: "space-between",

                mb: 1.5,

                px: 1.5,

              }}

            >

              <Typography>Subtotal</Typography>

              <Typography>{formatarDinheiro(subtotal)}</Typography>

            </Box>

            <Box

              sx={{

                display: "flex",

                justifyContent: "space-between",

                mb: 1.5,

                px: 1.5,

              }}

            >

              <Typography>Taxa de entrega</Typography>

              <Typography>

                {!cotacao || !opcaoAtual ? (

                  <Typography

                    component="span"

                    level="body-sm"

                    sx={{ opacity: 0.7 }}

                  >

                    Informe o CEP

                  </Typography>

                ) : taxaEntrega <= 0 ? (

                  <Typography component="span" color="success">

                    Grátis

                  </Typography>

                ) : (

                  formatarDinheiro(taxaEntrega)

                )}

              </Typography>

            </Box>

            <Box

              sx={{

                display: "flex",

                justifyContent: "space-between",

                fontWeight: "bold",

                mb: 1.5,

                px: 1.5,

              }}

            >

              <Typography>Total</Typography>

              <Typography>{formatarDinheiro(total)}</Typography>

            </Box>

            <Button

              variant="solid"

              color="primary"

              size="lg"

              sx={{ mx: 2, my: 2 }}

              disabled={!carrinhoData?.itens.length}

            >

              Finalizar Compra

            </Button>

          </CardContent>

        </Card>

      </Box>

    </Container>

  );

}

