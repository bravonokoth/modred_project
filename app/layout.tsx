

import type React from "react";
import type { Metadata, Viewport } from "next";
import { ClientWrapper } from "@/components/client-wrapper";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/work-sans/700.css";

export const metadata: Metadata = {
  title: "Modred - Blockchain IP Management Platform",
  description: "Secure, register, and manage your intellectual property on the blockchain with Modred",
  generator: "modred.app",
  keywords: "blockchain, intellectual property, IP management, NFT, licensing",
  authors: [{ name: "Modred Team" }],
  openGraph: {
    title: "Modred - Blockchain IP Management Platform",
    description: "Secure, register, and manage your intellectual property on the blockchain with Modred",
    type: "website",
    siteName: "Modred",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modred - Blockchain IP Management Platform",
    description: "Secure, register, and manage your intellectual property on the blockchain with Modred",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const generateElements = (count: number, className: string) =>
  Array.from({ length: count }, (_, i) => (
    <div key={`${className}-${i}`} className={className} />
  ));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <div className="cosmic-sky">
          {generateElements(15, "star")}
          {generateElements(5, "comet")}
        </div>
        <ClientWrapper>{children}</ClientWrapper>
        <Toaster />
      </body>
    </html>
  );
}