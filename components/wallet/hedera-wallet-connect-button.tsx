"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHederaWallet } from "./hedera-wallet-provider";
import { HashConnectConnectionState } from "hashconnect";

export const HederaWalletConnectButton = () => {
  const router = useRouter();
  const {
    accountId,
    isConnected,
    state,
    isInitialized,
    error,
    connect,
    disconnect,
  } = useHederaWallet();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connect();
    } catch (err) {
      console.error("❌ Connect failed:", err);
    } finally {
      setTimeout(() => setIsConnecting(false), 3000);
    }
  };

  const viewOnExplorer = () => {
    if (accountId) {
      const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK === "mainnet" ? "mainnet" : "testnet";
      window.open(`https://hashscan.io/${network}/account/${accountId}`, "_blank");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setMenuOpen(false);
  };

  // Show loading state during initialization
  if (!isInitialized) {
    return (
      <Button disabled variant="outline" className="min-w-[120px]">
        Loading...
      </Button>
    );
  }

  // Show connect button when not connected
  if (!isConnected) {
    const isLoading = isConnecting || state === HashConnectConnectionState.Connecting;

    return (
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={handleConnect}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </Button>
        {error && (
          <p className="text-sm text-red-600 max-w-xs text-center">{error}</p>
        )}
        {state && state !== HashConnectConnectionState.Disconnected && (
          <p className="text-xs text-gray-500">Status: {state}</p>
        )}
      </div>
    );
  }

  // Show connected state with dropdown menu
  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[120px]">
          {accountId
            ? `${accountId.slice(0, 6)}...${accountId.slice(-4)}`
            : "Connected"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          📊 Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={viewOnExplorer}>
          🔍 View on Explorer
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(accountId || "");
          }}
        >
          📋 Copy Account ID
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDisconnect}
          className="text-red-600 focus:text-red-600"
        >
          🔌 Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};