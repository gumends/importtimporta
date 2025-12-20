"use client";

import React from "react";
import {
  Modal,
  ModalDialog,
  Typography,
  Button,
  Box,
} from "@mui/joy";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <ModalDialog
        variant="outlined"
        sx={{
          background: "#111",
          padding: 3,
          borderRadius: "md",
          width: 400,
        }}
      >
        <Typography level="h4" sx={{ mb: 1 }}>
          {title}
        </Typography>

        <Typography level="body-md" sx={{ mb: 3, opacity: 0.8 }}>
          {message}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" color="neutral" onClick={onCancel}>
            Cancelar
          </Button>

          <Button variant="solid" color="danger" onClick={onConfirm}>
            Confirmar
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
