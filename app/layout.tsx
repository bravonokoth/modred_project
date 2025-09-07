import "@/lib/polyfills";
import type React from "react";
import type { Metadata } from "next";
import { Work_Sans, Open_Sans } from "next/font/google";
import { ClientWrapper } from "@/components/client-wrapper";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Modred - Blockchain IP Management Platform",
  description: "Secure, register, and manage your intellectual property on the blockchain with Modred",
  generator: "modred.app",
  keywords: "blockchain, intellectual property, IP management, NFT, licensing",
  authors: [{ name: "Modred Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${workSans.variable} ${openSans.variable} antialiased`}>
        <div className="cosmic-sky">
          {/* Stars */}
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          {/* Comets */}
          <div className="comet"></div>
          <div className="comet"></div>
          <div className="comet"></div>
          <div className="comet"></div>
          <div className="comet"></div>
        </div>
        <ClientWrapper>
          {children}
        </ClientWrapper>
        <Toaster />
      </body>
    </html>
  );
}