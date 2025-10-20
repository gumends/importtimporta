"use client";

import React from "react";
import produtos from "../../services/produtos/produtos.json";
import { Button } from "@mui/joy";

interface Promocao {
  id: number;
  nomeProduto: string;
  image: string;
  precoComDesconto: string;
  precoSemDesconto: string;
  descricao: string;
}

export default function Produto() {
  const [produto, setProduto] = React.useState<Promocao | null>(null);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoParam = urlParams.get("produtoId");

    if (!produtoParam) return;
    const produtoEncontrado = produtos.find(
      (p) => p.id === Number(produtoParam)
    );
    if (produtoEncontrado) {
      setProduto(produtoEncontrado);
    }
  }, [produto]);

  return (
    <div>
      <h1>{produto?.nomeProduto}</h1>
      <p>{produto?.descricao}</p>
      <p>Preço com desconto: {produto?.precoComDesconto}</p>
      <p>Preço sem desconto: {produto?.precoSemDesconto}</p>
      <img
        src={produto?.image}
        alt={produto?.nomeProduto}
        style={{ maxWidth: "300px" }}
      />
      <Button
        variant="solid"
        sx={{ mt: 2, bgcolor: "#fff", color: "#000" }}
        onClick={() =>
          (window.location.href = `https://wa.me/5511951663573?text=Ol%C3%A1%2C%20gostaria%20de%20comprar%20o%20produto%3A%20${encodeURIComponent(
            produto?.nomeProduto || ""
          )}`)
        }
      >
        Comprar
      </Button>
    </div>
  );
}
