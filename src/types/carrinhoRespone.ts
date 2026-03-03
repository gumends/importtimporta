import { Produto } from "./ProdutoNovo.type";

export interface CarrinhoResponse {
    subtotal: number;
    total: number;
    taxaEntrega: number;
    itens: NewCarrinhoDto[];
}

export interface NewCarrinhoDto {
    id: string;
    nomeProduto: string;
    valorUnitario: number;
    quantidade: number;
    totalItem: number;
    imagemUrl: string;
    descricao: string;
}