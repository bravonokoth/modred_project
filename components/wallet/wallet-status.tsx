"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useActiveAccount, useDisconnect } from "thirdweb/react";
import { useHederaWallet } from "./hedera-wallet-provider";
import { Wallet, Copy, ExternalLink, LogOut } from "lucide-react";

interface WalletInfo {
  address: string;
  chain: string;
}

export function WalletStatus() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const activeAccount = useActiveAccount();
  const { disconnect: disconnectThirdweb } = useDisconnect();
  const { accountId: hederaAccountId, isConnected: hederaConnected, disconnect: disconnectHedera } = useHederaWallet();

  useEffect(() => {
    // Check for stored wallet info
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      try {
        const parsed = JSON.parse(authToken);
        setWalletInfo(parsed);
      } catch (error) {
        console.error("Failed to parse auth token:", error);
      }
    }
    
    // Also check thirdweb and hedera connections
    if (activeAccount || hederaConnected) {
      const address = activeAccount?.address || hederaAccountId || "";
      const chain = activeAccount ? "ethereum" : "hedera";
      setWalletInfo({ address, chain });
    }
    setIsLoading(false);
  }, [activeAccount, hederaConnected, hederaAccountId]);

  const formatAddress = (address: string, chain: string) => {
    if (chain === "dummy") {
      return address; // Show full email for dummy
    }
    if (chain === "hedera") {
      return address; // Hedera addresses are already short
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getChainColor = (chain: string) => {
    switch (chain) {
      case "ethereum":
        return "bg-blue-500";
      case "hedera":
        return "bg-purple-500";
      case "solana":
        return "bg-green-500";
      case "dummy":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const copyAddress = async () => {
    if (walletInfo?.address) {
      await navigator.clipboard.writeText(walletInfo.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const viewOnExplorer = () => {
    if (!walletInfo) return;
    
    const { address, chain } = walletInfo;
    let explorerUrl = "";

    switch (chain) {
      case "ethereum":
        explorerUrl = `https://etherscan.io/address/${address}`;
        break;
      case "hedera":
        explorerUrl = `https://hashscan.io/testnet/account/${address}`;
        break;
      case "solana":
        explorerUrl = `https://explorer.solana.com/address/${address}`;
        break;
      default:
        return;
    }

    window.open(explorerUrl, "_blank");
  };

  const handleDisconnect = async () => {
    try {
      // Disconnect thirdweb wallets
      if (activeAccount) {
        await disconnectThirdweb();
      }

      // Disconnect Hedera wallet
      if (hederaConnected) {
        await disconnectHedera();
      }

      // Clear all stored data
      localStorage.removeItem("authToken");
      localStorage.removeItem("walletAddress");
      localStorage.removeItem("hedera_wallet_account");
      localStorage.removeItem("hedera_wallet_connected");
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      setWalletInfo(null);
      
      toast({
        title: "Wallet Disconnected",
        description: "You have been logged out",
      });
      
      router.push("/");
    } catch (err: any) {
      console.error("Disconnect error:", err);
      toast({
        title: "Disconnect Failed",
        description: `Failed to disconnect: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Button disabled variant="outline" className="min-w-[120px]">
        Loading...
      </Button>
    );
  }

  if (!walletInfo) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[120px] flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getChainColor(walletInfo.chain)}`} />
          {formatAddress(walletInfo.address, walletInfo.chain)}
          <Badge variant="secondary" className="text-xs">
            {walletInfo.chain}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <Wallet className="h-4 w-4 mr-2" />
          Dashboard
        </DropdownMenuItem>
        {walletInfo.chain !== "dummy" && (
          <>
            <DropdownMenuItem onClick={copyAddress}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Address
            </DropdownMenuItem>
            <DropdownMenuItem onClick={viewOnExplorer}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </DropdownMenuItem>
          </>
        )}
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
}