"use client";

import { ThirdwebProvider, ConnectButton } from "thirdweb/react";
import { client } from "@/lib/thirdweb";
import { createWallet } from "thirdweb/wallets";

// Pre-configure wallets if needed
const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("walletConnect"),
];

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      {children}
    </ThirdwebProvider>
  );
}

// If you need a connect button with pre-configured wallets
export function QuickConnectButton() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme="dark"
      connectModal={{ size: "wide" }}
    />
  );
}