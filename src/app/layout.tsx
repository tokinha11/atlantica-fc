import type { Metadata } from "next";
import { Cinzel, Rajdhani, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atlántica F.C. | Donec Vincas — Clubes Pro EA Sports FC 27",
  description:
    "Web oficial de Atlántica F.C., club competitivo de Clubes Pro de EA Sports FC 27. Donec vincas — Hasta que venzas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cinzel.variable} ${rajdhani.variable} ${montserrat.variable}`}
    >
      <body className="font-rajdhani bg-[#041122] text-white antialiased selection:bg-[#D49B35] selection:text-[#041122]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
