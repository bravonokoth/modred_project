"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useSendTransaction } from "@/hooks/useSendTransaction";

interface HederaWalletContextType {
  accountId: string | null;
  isConnected: boolean;
  isInitialized: boolean;
  state: string | null;
  error: string | null;
  connect: (accountId: string) => void;
  disconnect: () => void;
  sendHbar: (to: string, amount: number) => Promise<any>;
}

const HederaWalletContext = createContext<HederaWalletContextType | undefined>(undefined);

export function HederaWalletProvider({ children }: { children: ReactNode }) {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(true);
  const [state, setState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { sendTransaction } = useSendTransaction();

  const connect = useCallback((id: string) => {
    setAccountId(id);
    localStorage.setItem("hederaAccountId", id);
    setError(null);
  }, []);

  const disconnect = useCallback(() => {
    setAccountId(null);
    localStorage.removeItem("hederaAccountId");
    setError(null);
  }, []);

  const sendHbar = async (to: string, amount: number) => {
    if (!accountId) throw new Error("Wallet not connected");
    return await sendTransaction(to, amount);
  };

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem("hederaAccountId");
    if (saved) {
      setAccountId(saved);
    }
    setIsInitialized(true);
  }, []);

  return (
    <HederaWalletContext.Provider
      value={{
        accountId,
        isConnected: !!accountId,
        isInitialized,
        state,
        error,
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
