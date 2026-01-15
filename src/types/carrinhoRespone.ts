import { Produto } from "./ProdutoNovo.type";

export interface CarrinhoResponse {
    subtotal: number;
    total: number;
    taxaEntrega: number;
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