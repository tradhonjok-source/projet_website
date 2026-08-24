import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../fr/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cabinet d'Expertise DETIE - Reclutamiento Internacional",
  description: "Un mundo de talento a su alcance. Especialistas en reclutamiento internacional, apoyo legal e integración.",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
