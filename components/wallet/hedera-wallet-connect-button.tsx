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
import { Badge } from "@/components/ui/badge";
import { useHederaWallet } from "./hedera-wallet-provider";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Copy, ExternalLink, LogOut, Loader2 } from "lucide-react";

export const HederaWalletConnectButton = () => {
  const router = useRouter();
  const { toast } = useToast();
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
      
      if (!isInitialized) {
        throw new Error("Hedera wallet is still initializing");
      }

      // For demo purposes, use a mock account ID
      // In production, this would trigger HashPack extension
      const mockAccountId = "0.0.123456";
      await connect(mockAccountId);
      
      // Store auth info for the app
      const authToken = JSON.stringify({ address: mockAccountId, chain: "hedera" });
      localStorage.setItem("authToken", authToken);
      document.cookie = `auth-token=${authToken}; path=/; max-age=86400`;
      
      router.push("/dashboard");
    } catch (err: any) {
      console.error("❌ Connect failed:", err);
      toast({
        title: "Connection Failed",
        description: err.message || "Failed to connect to Hedera wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const viewOnExplorer = () => {
    if (accountId) {
      const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK === "mainnet" ? "mainnet" : "testnet";
      window.open(`https://hashscan.io/${network}/account/${accountId}`, "_blank");
    }
  };

  const copyAccountId = async () => {
    if (accountId) {
      await navigator.clipboard.writeText(accountId);
      toast({
        title: "Account ID Copied",
        description: "Hedera account ID copied to clipboard",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setMenuOpen(false);
    router.push("/");
  };

  // Show loading state during initialization
  if (!isInitialized) {
    return (
      <Button disabled variant="outline" className="min-w-[140px]">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Initializing...
      </Button>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          variant="outline"
          className="min-w-[140px]"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Retry Connection
            </>
          )}
        </Button>
        <p className="text-sm text-red-600 max-w-xs text-center">{error}</p>
      </div>
    );
  }

  // Show connect button when not connected
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="min-w-[140px]"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect HashPack
            </>
          )}
        </Button>
        {state && state !== "Disconnected" && (
          <p className="text-xs text-muted-foreground">Status: {state}</p>
        )}
      </div>
    );
  }

  // Show connected state with dropdown menu
  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[140px] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="flex-1 truncate">{accountId}</span>
          <Badge variant="secondary" className="text-xs">
            Hedera
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Hedera Account</p>
          <p className="text-xs text-muted-foreground">{accountId}</p>
        </div>
        
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <Wallet className="h-4 w-4 mr-2" />
          Dashboard
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={copyAccountId}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Account ID
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={viewOnExplorer}>
          <ExternalLink className="h-4 w-4 mr-2" />
          View on HashScan
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={handleDisconnect}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};