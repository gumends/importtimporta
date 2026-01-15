import { CarrinhoRequest } from "@/types/carrinhoRequest";
import { CarrinhoResponse } from "@/types/carrinhoRespone";

export class CarrinhoService {
  private readonly apiUrl = process.env.NEXT_PUBLIC_API_URL;

    async getCarrinho(): Promise<CarrinhoResponse> {
        const res = await fetch(
        `${this.apiUrl}/carrinho`,
        { 
            cache: "no-store", 
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("auth_token"),
            }
        }
        );

        if (!res.ok) {
            throw new Error("Erro ao buscar produtos");
        }

        return res.json();
    }

    async postCarrinho(carrinho: CarrinhoRequest, token: string): Promise<CarrinhoRequest> {
        const res = await fetch(`${this.apiUrl}/carrinho`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(carrinho),
        });

        if (!res.ok) {
            throw new Error("Erro ao criar produto");
        }

        return res.json();
    }

    async deleteItemCarrinho(id: number): Promise<CarrinhoRequest> {
        const res = await fetch(`${this.apiUrl}/carrinho/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
            },
        });

        if (!res.ok) {
            throw new Error("Erro ao criar produto");
        }

        return res.json();
    }
}