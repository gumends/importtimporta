export function formatarDinheiro(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function mascaraDinheiro(valor: string): string {
  const apenasNumeros = valor.replace(/\D/g, "");
  const numero = parseFloat(apenasNumeros) / 100;

  if (isNaN(numero)) return "";

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function removerMascaraDinheiro(valor: string): number {
  return Number(valor.replace(/\D/g, "")) / 100;
}