"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useSendTransaction } from "@/hooks/useSendTransaction";
import { useToast } from "@/hooks/use-toast";

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
  const [isInitialized, setIsInitialized] = useState(false);
  const [state, setState] = useState<string | null>("Disconnected");
  const [error, setError] = useState<string | null>(null);
  const { sendTransaction } = useSendTransaction();
  const { toast } = useToast();

  // Initialize Hedera wallet connection
  useEffect(() => {
    const initializeHedera = async () => {
      try {
        setState("Initializing");
        
        // Check if HashConnect is available
        if (typeof window !== "undefined") {
          // Simulate HashConnect initialization
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check for existing connection
          const savedAccountId = localStorage.getItem("hedera_wallet_account");
          const isConnected = localStorage.getItem("hedera_wallet_connected") === "true";
          
          if (savedAccountId && isConnected) {
            setAccountId(savedAccountId);
            setState("Connected");
          } else {
            setState("Disconnected");
          }
        }
        
        setIsInitialized(true);
        setError(null);
      } catch (err: any) {
        console.error("Hedera initialization failed:", err);
        setError("Failed to initialize Hedera wallet connection");
        setState("Error");
        setIsInitialized(true);
      }
    };

    initializeHedera();
  }, []);

  const connect = useCallback(async (id: string) => {
    try {
      setState("Connecting");
      setError(null);
      
      // Validate Hedera account ID format
      if (!/^\d+\.\d+\.\d+$/.test(id)) {
        throw new Error("Invalid Hedera account ID format. Use format: 0.0.123456");
      }

      // Simulate HashPack connection process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would:
      // 1. Open HashPack extension
      // 2. Request user approval
      // 3. Get signed approval from HashPack
      // 4. Establish connection
      
      setAccountId(id);
      localStorage.setItem("hedera_wallet_account", id);
      localStorage.setItem("hedera_wallet_connected", "true");
      setState("Connected");
      
      toast({
        title: "Hedera Wallet Connected",
        description: `Connected to account ${id}`,
      });
    } catch (err: any) {
      console.error("Hedera connection failed:", err);
      setError(err.message || "Failed to connect to Hedera wallet");
      setState("Error");
      throw err;
    }
  }, [toast]);

  const disconnect = useCallback(() => {
    setAccountId(null);
    localStorage.removeItem("hedera_wallet_account");
    localStorage.removeItem("hedera_wallet_connected");
    localStorage.removeItem("authToken");
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setState("Disconnected");
    setError(null);
    
    toast({
      title: "Hedera Wallet Disconnected",
      description: "Successfully disconnected from Hedera network",
    });
  }, [toast]);

  const sendHbar = async (to: string, amount: number) => {
    if (!accountId) throw new Error("Wallet not connected");
    
    try {
      setState("Sending");
      const result = await sendTransaction(to, amount);
      setState("Connected");
      return result;
    } catch (err) {
      setState("Connected");
      throw err;
    }
  };

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