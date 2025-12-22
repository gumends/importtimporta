import { Snackbar, Alert } from "@mui/joy";
import ReactDOM from "react-dom";

interface Props {
  aberto: boolean;
  mensagem: string;
  tipo: "success" | "danger" | "warning" | "primary" | "neutral";
  aoFechar: () => void;
  tempo?: number;
}

export default function Alerta({ mensagem, tipo = "neutral", aberto, aoFechar, tempo }: Props) {
  if (typeof window === "undefined") return null;
  return ReactDOM.createPortal(
    <Snackbar
      autoHideDuration={tempo || 3000}
      open={aberto}
      color={tipo}
      variant="soft"
      onClose={() => aoFechar()}
      sx={{
        zIndex: 99999
      }}
    >
      {mensagem}
    </Snackbar>,
    document.body
  );
}
