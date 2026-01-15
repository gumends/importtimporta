"use client"

import { Box, Button, Card, CardContent, Container, Divider, IconButton, Typography } from "@mui/joy";
import { Plus, Trash2 } from "lucide-react";
import RemoveIcon from '@mui/icons-material/Remove';
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
        service.getCarrinho().then((data) => {
            setCarrinhoData(data);
        }).catch((error) => {
            console.error("Erro ao buscar carrinho:", error);
        });
    }

    const deletarItem = (id: number) => {
        service.deleteItemCarrinho(id).then(() => {
            buscarCarrinho();
        })
    }

    return (
        <Container sx={{ display: "flex", width: "100%", gap: 2, py: 4 }}>
            <Box sx={{ width: "100%" }}>
                {carrinhoData && carrinhoData?.carrinhos.length > 0 && carrinhoData?.carrinhos.map((item, key) => (
                    <Card onClick={() => {}} variant="outlined" key={key} invertedColors sx={{ position: "relative", mb: 2 }}>
                        <CardContent orientation="horizontal">
                            <Box
                                component="img"
                                sx={{
                                    height: 150,
                                    width: 150,
                                    borderRadius: 2,
                                    marginRight: 2,
                                    objectFit: "cover"
                                }}
                                src={item.produto.imagens ? item.produto.imagens[0]?.caminho : "/placeholder.png"}
                                alt={item.produto.nomeProduto}
                            />
                            <CardContent>
                                <Typography level="body-lg">{item.produto.nomeProduto}</Typography>
                                <Typography level="body-sm">{item.produto.descricao}</Typography>
                                <Typography level="h2">{formatarDinheiro(Number(item.produto.valor))}</Typography>
                                <Box sx={{
                                    display: "flex", alignItems: "center"
                                }}>
                                    <IconButton onClick={() => setQuantidade(quantidade > 1 ? quantidade - 1 : 1)}><RemoveIcon /></IconButton>
                                    <Typography component="span" sx={{ mx: 1, width: 20, textAlign: "center" }}>{item.Quantidade}</Typography>
                                    <IconButton onClick={() => setQuantidade(quantidade + 1)}><Plus /></IconButton>
                                    <Typography level="body-xs" sx={{ ml: 2 }}>{item.produto.quantidade} disponiveis</Typography>
                                </Box>
                            </CardContent>
                        </CardContent>
                        <IconButton onClick={() => {deletarItem(item.id)}} variant="outlined" size="md" color="danger" sx={{ position: "absolute", top: 8, right: 8, zIndex: 99 }}>
                            <Trash2 />
                        </IconButton>
                    </Card>
                ))} 
                {
                    carrinhoData?.carrinhos.length === 0 && (
                        <Typography level="h4" sx={{ textAlign: "center", mt: 4 }}>
                            Seu carrinho está vazio.
                        </Typography>
                    )
                }
            </Box>
            <Box sx={{ width: "40%" }}>
                <Card sx={{ margin: 0, padding: 0 }}>
                    <CardContent sx={{ px: 1.5, pt: 2, pb: 1 }}>
                        <Typography level="body-lg">Resumo da compra</Typography>
                    </CardContent>
                    <Divider/>
                    <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5, px: 1.5 }}>
                            <Typography>Subtotal</Typography>
                            <Typography>{formatarDinheiro(Number(carrinhoData?.subtotal ?? 0))}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5, px: 1.5 }}>
                            <Typography>Taxa de entrega</Typography>
                            <Typography color="success">Grátis</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", mb: 1.5, px: 1.5 }}>
                            <Typography>Total</Typography>
                            <Typography>{formatarDinheiro(Number(carrinhoData?.total ?? 0))}</Typography>
                        </Box>
                        <Button variant="solid" color="primary" size="lg" sx={{ mx: 2, my: 2 }}>
                            Finalizar Compra
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    )
}