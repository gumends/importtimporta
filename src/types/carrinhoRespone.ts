import { Produto } from "./ProdutoNovo.type";

export interface CarrinhoResponse {
    subtotal: Number;
    total: Number;
    taxaEntrega: Number;
    carrinhos: NewCarrinhoDto[];
}

export interface NewCarrinhoDto {
    id: number;
    IdProduto: number;
    Quantidade: number;
    IdUsuario: number;
    CriadoEm: Date;
    produto: Produto;
}