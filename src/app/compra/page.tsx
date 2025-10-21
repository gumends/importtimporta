"use client";

import React from "react";
import { Button } from "@mui/joy";
import { Produto as p } from "../../types/produto.type";
import { getProduto } from "@/services/produtos/produtos.service";
export default function Produto() {
  const [produto, setProduto] = React.useState<p | null>(null);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoParam = urlParams.get("id");
    if (produtoParam) {
      const produtoId = parseInt(produtoParam, 10);
      getProduto(produtoId).then((prod) => {
        if (prod) {
          setProduto(prod);
        }
      });
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
