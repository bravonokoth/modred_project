"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { usePaymentWallet } from "./payment-wallet-provider";
import { useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react";
import { multiChainService } from "@/lib/blockchain/multi-chain";
import { Wallet, Copy, ExternalLink, LogOut, DollarSign } from "lucide-react";

interface WalletInfo {
  address: string;
  chain: string;
}

export function EnhancedWalletStatus() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { balance } = usePaymentWallet();
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { disconnect: disconnectThirdweb } = useDisconnect();

  useEffect(() => {
    setIsLoading(true);
    let address: string | undefined;
    let chain: string | undefined;

    // Check for stored wallet info
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      try {
        const parsed = JSON.parse(authToken);
        if (parsed.address && parsed.chain) {
          address = parsed.address;
          chain = parsed.chain;
        }
      } catch (error) {
        console.error("Failed to parse auth token:", error);
      }
    }

    // Override with active wallet connections
    const hederaAccountId = localStorage.getItem("hedera_account_id");
    if (hederaAccountId) {
      address = hederaAccountId;
      chain = "hedera";
    } else if (activeAccount?.address) {
      address = activeAccount.address;
      chain = "ethereum";
    }

    // Only set walletInfo if valid data exists
    if (address && chain) {
      setWalletInfo({ address, chain });
    } else {
      setWalletInfo(null);
    }

    setIsLoading(false);
  }, [activeAccount]);

  const formatAddress = (address?: string | null, chain?: string): string => {
    if (!address) return "Not connected";
    if (chain === "dummy" || chain === "email") {
      return address.length > 20 ? `${address.slice(0, 17)}...` : address;
    }
    if (chain === "hedera") {
      return address;
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getChainColor = (chain?: string): string => {
    switch (chain) {
      case "ethereum":
        return "bg-blue-500";
      case "hedera":
        return "bg-purple-500";
      case "solana":
        return "bg-green-500";
      case "dummy":
      case "email":
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
      if (activeWallet) {
        await disconnectThirdweb(activeWallet);
      }

      // Disconnect Hedera if connected
      const hederaAccountId = localStorage.getItem("hedera_account_id");
      if (hederaAccountId) {
        const hederaService = multiChainService.getService("hedera");
        if (hederaService) {
          await hederaService.disconnect();
        }
      }

      // Clear all stored data
      localStorage.removeItem("authToken");
      localStorage.removeItem("walletAddress");
      localStorage.removeItem("hedera_wallet_account");
      localStorage.removeItem("hedera_wallet_connected");
      localStorage.removeItem("hedera_account_id");
      localStorage.removeItem("hedera_topic");
      
      // Clear payment wallet data
      localStorage.removeItem("payment_wallet_balance");
      localStorage.removeItem("payment_wallet_transactions");
      
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      setWalletInfo(null);

      toast({
        title: "Wallet Disconnected",
        description: "All wallet connections cleared. You will need to reconnect.",
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
    return (
      <Button
        variant="outline"
        className="min-w-[140px] flex items-center gap-2"
        onClick={() => router.push("/connect")}
      >
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[140px] flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getChainColor(walletInfo.chain)}`} />
          <span className="flex-1 truncate">{formatAddress(walletInfo.address, walletInfo.chain)}</span>
          <Badge variant="secondary" className="text-xs">
            {walletInfo.chain}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Connected Wallet</p>
          <p className="text-xs text-muted-foreground">{formatAddress(walletInfo.address, walletInfo.chain)}</p>
        </div>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Balance:</span>
            <span className="text-sm font-medium">{balance !== undefined ? `$${balance.toFixed(2)}` : "N/A"}</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <Wallet className="h-4 w-4 mr-2" />
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/dashboard/wallet")}>
          <DollarSign className="h-4 w-4 mr-2" />
          Manage Wallet
        </DropdownMenuItem>

        {walletInfo.chain !== "dummy" && walletInfo.chain !== "email" && (
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

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDisconnect} className="text-red-600 focus:text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}