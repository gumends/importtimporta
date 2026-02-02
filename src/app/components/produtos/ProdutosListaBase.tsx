"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardOverflow,
  AspectRatio,
  Button,
  Stack,
  Input,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import { ProdutoService } from "@/services/produto/produto.service";
import { Produto } from "@/types/ProdutoNovo.type";
import { formatarDinheiro } from "@/utils/mascara_dinheiro";

interface Props {
  tipoProduto: number;
  titulo?: string;
  itensPorPagina?: number;
}

export default function ProdutosListaBase({
  tipoProduto,
  titulo = "Produtos disponíveis",
  itensPorPagina = 8,
}: Props) {
  const router = useRouter();
  const produtoService = new ProdutoService();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const [nomeProduto, setNomeProduto] = useState("");
  const [precoMinimo, setPrecoMinimo] = useState<number | undefined>();
  const [precoMaximo, setPrecoMaximo] = useState<number | undefined>();

  const carregarProdutos = async () => {
    const data = await produtoService.getProdutosPorTipo(
      pagina,
      itensPorPagina,
      tipoProduto,
    );

    setProdutos(data.itens);
    setTotalPaginas(data.totalPaginas);
  };

  useEffect(() => {
    carregarProdutos();
  }, [pagina]);

  const aplicarFiltros = async () => {
    setPagina(1);
    await carregarProdutos();
  };

  return (
    <Box sx={{ color: "#fff", minHeight: "100vh", py: 6, px: { xs: 2, md: 6 } }}>
      <Typography level="h2" sx={{ fontWeight: 600, textAlign: "center", mb: 4 }}>
        {titulo}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 5,
          justifyContent: "center",
        }}
      >
        <Input
          placeholder="Buscar por nome"
          value={nomeProduto}
          onChange={(e) => setNomeProduto(e.target.value)}
        />

        <Input
          placeholder="Preço mínimo"
          type="number"
          value={precoMinimo ?? ""}
          onChange={(e) => setPrecoMinimo(Number(e.target.value) || undefined)}
        />

        <Input
          placeholder="Preço máximo"
          type="number"
          value={precoMaximo ?? ""}
          onChange={(e) => setPrecoMaximo(Number(e.target.value) || undefined)}
        />

        <Button onClick={aplicarFiltros}>Aplicar filtros</Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 4,
        }}
      >
        {produtos.length > 0 ? (
          produtos.map((p) => (
            <Card key={p.id} variant="outlined" sx={{ bgcolor: "#121212" }}>
              <CardOverflow>
                <AspectRatio ratio="1" sx={{ bgcolor: "#000" }}>
                  <img
                    src={
                      Array.isArray(p.imagens)
                        ? p.imagens[0].caminho
                        : p.imagens || undefined
                    }
                    alt={p.nomeProduto}
                    style={{ objectFit: "contain", padding: "10px" }}
                  />
                </AspectRatio>
              </CardOverflow>

              <CardContent>
                <Typography level="title-md">{p.nomeProduto}</Typography>

                <Typography level="body-sm" sx={{ opacity: 0.7 }}>
                  {p.descricao}
                </Typography>

                {p.valorOriginal > (p.valor ?? 0) && (
                  <Typography
                    level="body-sm"
                    sx={{ textDecoration: "line-through", opacity: 0.6 }}
                  >
                    {formatarDinheiro(p.valorOriginal)}
                  </Typography>
                )}

                <Typography level="title-lg" sx={{ fontWeight: "bold", mt: 1 }}>
                  {formatarDinheiro(p.valor ?? 0)}
                </Typography>

                <Button
                  fullWidth
                  onClick={() =>
                    router.push(`/compra?produtoId=${p.id}`)
                  }
                >
                  Comprar agora
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography textAlign="center" sx={{ opacity: 0.7 }}>
            Nenhum produto encontrado.
          </Typography>
        )}
      </Box>

      {/* PAGINAÇÃO */}
      <Stack direction="row" justifyContent="center" spacing={2} mt={6}>
        <Button
          variant="outlined"
          onClick={() => setPagina((n) => Math.max(1, n - 1))}
          disabled={pagina === 1}
        >
          Anterior
        </Button>

        <Typography>
          Página {pagina} de {totalPaginas}
        </Typography>

        <Button
          variant="outlined"
          onClick={() => setPagina((n) => Math.min(totalPaginas, n + 1))}
          disabled={pagina === totalPaginas}
        >
          Próxima
        </Button>
      </Stack>
    </Box>
  );
}
