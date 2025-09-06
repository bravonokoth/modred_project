// components/wallet/hedera-wallet-provider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LedgerId } from "@hashgraph/sdk";
import { useRouter } from "next/navigation";

interface HederaWalletContextType {
  accountId: string | null;
  isConnected: boolean;
  state: any; // Use `any` temporarily; replace with HashConnectConnectionState type
  isInitialized: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendTransaction?: (accountId: string, transaction: any) => Promise<any>;
  signMessage?: (accountId: string, message: string) => Promise<any>;
}

const HederaWalletContext = createContext<HederaWalletContextType | undefined>(undefined);

export const useHederaWallet = () => {
  const ctx = useContext(HederaWalletContext);
  if (!ctx) throw new Error("useHederaWallet must be used inside HederaWalletProvider");
  return ctx;
};

interface Props {
  children: ReactNode;
}

export const HederaWalletProvider: React.FC<Props> = ({ children }) => {
  const [hashconnect, setHashconnect] = useState<any | null>(null); // Use `any` temporarily
  const [accountId, setAccountId] = useState<string | null>(null);
  const [state, setState] = useState<any>(null); // Use `any` temporarily
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        // Dynamically import hashconnect
        const { HashConnect, HashConnectConnectionState } = await import("hashconnect");

        const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;

        if (!projectId) {
          const errorMsg = "Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in .env.local";
          console.error(errorMsg);
          setError(errorMsg);
          setIsInitialized(true);
          return;
        }

        const appMetadata = {
          name: process.env.NEXT_PUBLIC_APP_NAME || "Modred",
          description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Blockchain IP Management Platform",
          url: process.env.NEXT_PUBLIC_APP_URL || window.location.origin,
          icons: [process.env.NEXT_PUBLIC_APP_ICON || "/favicon.ico"],
        };

        const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK === "mainnet" ? LedgerId.MAINNET : LedgerId.TESTNET;

        console.log("Initializing HashConnect with:", { projectId: projectId.slice(0, 8) + "...", network: network.toString() });

        const hc = new HashConnect(network, projectId, appMetadata, true);
        setHashconnect(hc);

        // Register events
        hc.pairingEvent.on((pairing: any) => {
          console.log("Paired with wallet:", pairing);
          if (pairing.accountIds && pairing.accountIds.length > 0) {
            const acct = pairing.accountIds[0];
            setAccountId(acct);
            localStorage.setItem("hedera_wallet_account", acct);
            localStorage.setItem("hedera_wallet_connected", "true");
            setError(null);
            setIsConnecting(false);
            console.log("Navigating to dashboard after successful pairing");
            router.push("/dashboard");
          }
        });

        hc.disconnectionEvent.on((data: any) => {
          console.log("Disconnected:", data);
          setAccountId(null);
          setIsConnecting(false);
          localStorage.removeItem("hedera_wallet_account");
          localStorage.removeItem("hedera_wallet_connected");
        });

        hc.connectionStatusChangeEvent.on((connectionStatus: any) => {
          console.log("Connection status changed:", connectionStatus);
          setState(connectionStatus);
          if (connectionStatus === HashConnectConnectionState.Paired) {
            setIsConnecting(false);
            console.log("Successfully paired!");
          } else if (connectionStatus === HashConnectConnectionState.Disconnected) {
            setIsConnecting(false);
          }
        });

        // Initialize HashConnect
        const initData = await hc.init();
        console.log("HashConnect initialized:", initData);

        // Restore previous session
        const savedConnection = localStorage.getItem("hedera_wallet_connected");
        const savedAccount = localStorage.getItem("hedera_wallet_account");

        if (savedConnection === "true" && savedAccount) {
          console.log("Restoring previous session:", savedAccount);
          setAccountId(savedAccount);
        }

        setIsInitialized(true);
        setError(null);
      } catch (err: any) {
        console.error("Failed to initialize HashConnect:", err);
        setError(err.message || "Failed to initialize wallet connection");
        setIsInitialized(true);
        setIsConnecting(false);
      }
    };

    if (typeof window !== "undefined") {
      init();
    }
  }, [router]);

  const connect = async () => {
    if (!hashconnect) {
      setError("HashConnect not initialized");
      return;
    }

    if (isConnecting) {
      console.log("Connection already in progress...");
      return;
    }

    try {
      console.log("Opening pairing modal...");
      setError(null);
      setIsConnecting(true);

      hashconnect.openPairingModal({
        themeMode: "light",
        backgroundColor: "#ffffff",
        accentColor: "#000000",
        accentFillColor: "#ffffff",
        borderRadius: "12px",
      });
    } catch (err: any) {
      console.error("Failed to open pairing modal:", err);
      setError(err.message || "Failed to connect");
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    try {
      if (hashconnect) {
        hashconnect.disconnect();
      }
      setAccountId(null);
      setIsConnecting(false);
      localStorage.removeItem("hedera_wallet_account");
      localStorage.removeItem("hedera_wallet_connected");
      setError(null);
      console.log("Disconnected successfully");
    } catch (err: any) {
      console.error("Error during disconnect:", err);
    }
  };

  const sendTransaction = async (accountId: string, transaction: any) => {
    if (!hashconnect) {
      throw new Error("HashConnect not initialized");
    }
    return await hashconnect.sendTransaction(accountId, transaction);
  };

  const signMessage = async (accountId: string, message: string) => {
    if (!hashconnect) {
      throw new Error("HashConnect not initialized");
    }
    return await hashconnect.signMessages(accountId, message);
  };

  const contextValue: HederaWalletContextType = {
    accountId,
    isConnected: !!accountId && state === "Paired", // Adjust based on actual HashConnectConnectionState
    state,
    isInitialized,
    error,
    connect,
    disconnect,
    sendTransaction,
    signMessage,
  };

  return (
    <HederaWalletContext.Provider value={contextValue}>
      {children}
    </HederaWalletContext.Provider>
  );
};