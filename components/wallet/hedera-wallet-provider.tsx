"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSendTransaction } from "@/hooks/useSendTransaction";

interface HederaWalletContextType {
  accountId: string | null;
  isConnected: boolean;
  connect: (accountId: string) => void;
  disconnect: () => void;
  sendHbar: (to: string, amount: number) => Promise<any>;
}

const HederaWalletContext = createContext<HederaWalletContextType | undefined>(undefined);

export function HederaWalletProvider({ children }: { children: ReactNode }) {
  const [accountId, setAccountId] = useState<string | null>(null);
  const { sendTransaction } = useSendTransaction();

  const connect = (id: string) => {
    setAccountId(id);
    localStorage.setItem("hederaAccountId", id);
  };

  const disconnect = () => {
    setAccountId(null);
    localStorage.removeItem("hederaAccountId");
  };

  const sendHbar = async (to: string, amount: number) => {
    if (!accountId) throw new Error("Wallet not connected");
    return await sendTransaction(to, amount);
  };

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem("hederaAccountId");
    if (saved) setAccountId(saved);
  }, []);

  return (
    <HederaWalletContext.Provider
      value={{
        accountId,
        isConnected: !!accountId,
        connect,
        disconnect,
        sendHbar,
      }}
    >
      {children}
    </HederaWalletContext.Provider>
  );
}

export function useHederaWallet() {
  const ctx = useContext(HederaWalletContext);
  if (!ctx) throw new Error("useHederaWallet must be used within HederaWalletProvider");
  return ctx;
}
