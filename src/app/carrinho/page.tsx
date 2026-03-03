"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/joy";
import { Plus, Trash2 } from "lucide-react";
import RemoveIcon from "@mui/icons-material/Remove";
import React from "react";
import { CarrinhoService } from "@/services/carrinho/carrinho.service";
import { CarrinhoResponse } from "@/types/carrinhoRespone";
import { formatarDinheiro } from "@/utils/mascara_dinheiro";

export default function Carrinho() {
  const [quantidade, setQuantidade] = React.useState(1);
  const [carrinhoData, setCarrinhoData] = React.useState<CarrinhoResponse>();
  const service = new CarrinhoService();

  React.useEffect(() => {
    buscarCarrinho();
  }, []);

  const buscarCarrinho = () => {
    const token = sessionStorage.getItem("auth_token");

    if (!token) {
      const carrinhoStorage = sessionStorage.getItem("carrinho");

      if (carrinhoStorage) {
        const carrinhoLocal: CarrinhoResponse = JSON.parse(carrinhoStorage);
        setCarrinhoData(carrinhoLocal);
      } else {
        setCarrinhoData({
          subtotal: 0,
          total: 0,
          taxaEntrega: 0,
          itens: [],
        });
      }

      return;
    }
    service
      .getCarrinho()
      .then((data) => {
        console.log(data);
        
        setCarrinhoData(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar carrinho:", error);
      });
  };

  const deletarItem = (id: string) => {
    const token = sessionStorage.getItem("auth_token");

    if (!token) {
      const carrinhoStorage = sessionStorage.getItem("carrinho");

      if (!carrinhoStorage) return;

      const carrinho: CarrinhoResponse = JSON.parse(carrinhoStorage);

      carrinho.itens = carrinho.itens.filter((item) => item.id !== id);

      carrinho.subtotal = carrinho.itens.reduce(
        (acc, item) => acc + (item.valorUnitario ?? 0) * item.quantidade,
        0,
      );

      carrinho.total = carrinho.subtotal + carrinho.taxaEntrega;

      sessionStorage.setItem("carrinho", JSON.stringify(carrinho));
      setCarrinhoData(carrinho);
      return;
    }
    
    service.deleteItemCarrinho(id).then(() => {
      buscarCarrinho();
    });
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
                  src={
                    item.imagemUrl
                  }
                  alt={item.nomeProduto}
                />
                <CardContent>
                  <Typography level="body-lg">
                    {item.nomeProduto}
                  </Typography>
                  <Typography level="body-sm">
                    {item.descricao}
                  </Typography>
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
      <Box sx={{ width: "40%" }}>
        <Card sx={{ margin: 0, padding: 0 }}>
          <CardContent sx={{ px: 1.5, pt: 2, pb: 1 }}>
            <Typography level="body-lg">Resumo da compra</Typography>
          </CardContent>
          <Divider />
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1.5,
                px: 1.5,
              }}
            >
              <Typography>Subtotal</Typography>
              <Typography>
                {formatarDinheiro(Number(carrinhoData?.subtotal ?? 0))}
              </Typography>
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
              <Typography color="success">Grátis</Typography>
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
              <Typography>
                {formatarDinheiro(Number(carrinhoData?.total ?? 0))}
              </Typography>
            </Box>
            <Button
              variant="solid"
              color="primary"
              size="lg"
              sx={{ mx: 2, my: 2 }}
            >
              Finalizar Compra
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
