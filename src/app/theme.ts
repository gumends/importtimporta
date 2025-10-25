"use client";
import { extendTheme } from "@mui/joy/styles";

export const darkTheme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: "#0a0a0a",
          surface: "#121212",
        },
        text: {
          primary: "#f8fafc",
          secondary: "#94a3b8",
        },
      },
    },
  },
});
