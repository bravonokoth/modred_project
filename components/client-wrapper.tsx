"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { PaymentWalletProvider } from "@/components/wallet/payment-wallet-provider";
import { ThirdwebProvider } from "thirdweb/react";
import { client } from "@/lib/thirdweb";

interface ClientWrapperProps {
  children: ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <ThemeProvider defaultTheme="light">
      <ThirdwebProvider>
        <PaymentWalletProvider>
          <div className="theme-transition">{children}</div>
        </PaymentWalletProvider>
      </ThirdwebProvider>
    </ThemeProvider>
  );
}
