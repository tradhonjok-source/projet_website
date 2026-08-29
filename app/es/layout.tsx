import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gabinete de Experticia DETIE - Reclutamiento Internacional a Medida",
  description: "Un mundo de talento a su alcance. Especialistas en reclutamiento internacional, asesoría jurídica e integración.",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
