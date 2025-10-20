import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@fontsource/inter";
import AppBar from "./components/AppBar";
import { Box } from "@mui/joy";
import Footer from "./components/Footer";
import ModalInicial from "./components/ModalInicial";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ImporttImporta",
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
          color: "#f8fafc",
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflowX: "hidden",
            color: "var(--foreground)",
          }}
        >
          <Box
            sx={{
              bgcolor: "#0a0a0a",
              color: "#fff",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <ModalInicial />
            <AppBar />
            {children}
          </Box>
        </Box>
        <Footer />
      </body>
    </html>
  );
}
