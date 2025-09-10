// useHederaWallet.ts
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  HashConnect,
  HashConnectConnectionState,
  SessionData,
} from "hashconnect";
import { LedgerId } from "@hashgraph/sdk";
import { useSendTransaction } from "@/hooks/useSendTransaction";

interface HederaWalletContextType {
  accountId: string | null;
  isConnected: boolean;
  isInitialized: boolean;
  state: string | null;
  error: string | null;
  connect: (accountId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  sendHbar: (to: string, amount: number) => Promise<any>;
}

const HederaWalletContext = createContext<
  HederaWalletContextType | undefined
>(undefined);

// ✅ Load from .env
const appMetadata = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Default Dapp Name",
  description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Default Dapp Description",
  icons: [
    process.env.NEXT_PUBLIC_APP_ICON ||
      "https://your-dapp.com/icon.png",
  ],
  url: process.env.NEXT_PUBLIC_APP_URL || "https://your-dapp.com",
};

const hederaNetwork =
  process.env.NEXT_PUBLIC_HEDERA_NETWORK || "testnet";
const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export function HederaWalletProvider({ children }: { children: ReactNode }) {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [state, setState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hashconnect, setHashconnect] = useState<HashConnect | null>(null);
  const [pairingData, setPairingData] = useState<SessionData | null>(null);
  const { sendTransaction } = useSendTransaction();

  useEffect(() => {
    const initializeHashConnect = async () => {
      try {
        const ledgerId = LedgerId.fromString(hederaNetwork);
        const hc = new HashConnect(
          ledgerId,
          walletConnectProjectId,
          appMetadata,
          true
        );
        setHashconnect(hc);

        // Pairing event
        hc.pairingEvent.on((newPairing) => {
          setPairingData(newPairing);
          setAccountId(newPairing.accountIds[0] || null);
          setIsConnected(true);
          setState(HashConnectConnectionState.Paired);
          localStorage.setItem(
            "hederaAccountId",
            newPairing.accountIds[0] || ""
          );
        });

        // Disconnection event
        hc.disconnectionEvent.on(() => {
          setPairingData(null);
          setAccountId(null);
          setIsConnected(false);
          setState(HashConnectConnectionState.Disconnected);
          localStorage.removeItem("hederaAccountId");
        });

        // Status change
        hc.connectionStatusChangeEvent.on((connectionStatus) => {
          setState(connectionStatus);
        });

        // Initialize HashConnect
        await hc.init();
        setIsInitialized(true);

        // Restore previous session if exists
        const saved = localStorage.getItem("hederaAccountId");
        if (saved && saved.match(/^\d+\.\d+\.\d+$/)) {
          setAccountId(saved);
          setIsConnected(true);
          setState(HashConnectConnectionState.Paired);
        }
      } catch (err: any) {
        setError(`Failed to initialize HashConnect: ${err.message}`);
        setIsInitialized(false);
      }
    };

    initializeHashConnect();
  }, []);

  const connect = useCallback(
    async (id: string) => {
      if (!hashconnect) {
        throw new Error("HashConnect is not initialized");
      }

      if (!/^\d+\.\d+\.\d+$/.test(id)) {
        throw new Error("Invalid Hedera account ID format");
      }

      try {
        await hashconnect.openPairingModal();

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error("Pairing timed out")),
            30000
          );
          hashconnect.pairingEvent.once(() => {
            clearTimeout(timeout);
            resolve(true);
          });
        });

        if (!pairingData?.accountIds.includes(id)) {
          throw new Error("Failed to pair with the specified account ID");
        }

        setAccountId(id);
        setIsConnected(true);
        localStorage.setItem("hederaAccountId", id);
        setError(null);
      } catch (err: any) {
        setError(`Failed to connect to HashPack: ${err.message}`);
        throw err;
      }
    },
    [hashconnect, pairingData]
  );

  const disconnect = useCallback(async () => {
    if (!hashconnect) {
      throw new Error("HashConnect is not initialized");
    }

    try {
      await hashconnect.disconnect();
      setAccountId(null);
      setIsConnected(false);
      setPairingData(null);
      setState(HashConnectConnectionState.Disconnected);
      localStorage.removeItem("hederaAccountId");
      setError(null);
    } catch (err: any) {
      setError(`Failed to disconnect: ${err.message}`);
      throw err;
    }
  }, [hashconnect]);

  const sendHbar = async (to: string, amount: number) => {
    if (!accountId) throw new Error("Wallet not connected");
    return await sendTransaction(to, amount);
  };

  return (
    <HederaWalletContext.Provider
      value={{
        accountId,
        isConnected,
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
  if (!ctx)
    throw new Error(
      "useHederaWallet must be used within HederaWalletProvider"
    );
  return ctx;
}
