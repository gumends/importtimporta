import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@fontsource/inter";
import AppBar from "./components/AppBar";
import { Box } from "@mui/joy";
import Footer from "./components/Footer";
import { CssVarsProvider } from "@mui/joy/styles";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Import Importa",
  description: "Seu portal de tecnologia e lançamentos",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          backgroundColor: "#000",
          color: "#f8fafc",
        }}
      >
        <CssVarsProvider defaultMode="dark">
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              width: "100%",
              overflowX: "hidden",
              bgcolor: "#000",
              color: "#fff",
            }}
          >
            <AppBar />
            <Box component="main" sx={{ flex: 1, width: "100%" }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </CssVarsProvider>
      </body>
    </html>
  );
}
