"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/joy/Box";

export default function ModalInicial() {
  const [visible, setVisible] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setShowImage(true), 250);
    const t2 = setTimeout(() => setFadingOut(true), 2000);
    const t3 = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = prevOverflow || "";
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.body.style.overflow = prevOverflow || "";
    };
  }, []);

  if (!visible) return null;

  return (
    <Box
      component="div"
      role="dialog"
      aria-hidden={!visible}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 14000,
        bgcolor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: fadingOut ? 0 : 1,
        transition: "opacity 2000ms ease-in-out",
      }}
    >
      <Box
        component="img"
        src="/logo-intro.png"
        alt="Logo Intro"
        sx={{
          width: { xs: 180, md: 320 },
          maxWidth: "88%",
          pointerEvents: "none",
          opacity: showImage ? 1 : 0,
          transition: "opacity 2000ms ease-in-out",
        }}
      />
    </Box>
  );
}