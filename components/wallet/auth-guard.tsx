"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { HederaService } from "@/lib/blockchain/hedera/hedera-service";
import { MultiWalletConnectButton } from "./multi-wallet-connect-button";
import { useActiveAccount, useActiveWallet } from "@thirdweb-dev/react";
import { useToast } from "@/hooks/use-toast";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hederaService, setHederaService] = useState<HederaService | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [authType, setAuthType] = useState<
    "hedera" | "metamask" | "email" | "trustwallet" | "walletconnect" | "coinbase" | "rainbow" | "zerion" | "okx" | "binance" | null
  >(null);
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const service = new HederaService();
      setHederaService(service);

      const checkAuth = async () => {
        // Check Hedera authentication
        const hederaAccountId = service.getAccountId();
        const hederaSignedMessage = localStorage.getItem("signed_message");
        const authToken = localStorage.getItem("authToken");
        const cookieAuth = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth-token="));

        if (hederaAccountId && hederaSignedMessage && (authToken || cookieAuth)) {
          setAccountId(hederaAccountId);
          setAuthType("hedera");
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Check Thirdweb authentication (MetaMask, email, etc.)
        if (activeAccount && authToken) {
          const { address, chain } = JSON.parse(authToken);
          setAccountId(address);
          setAuthType(chain as typeof authType);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
      };

      checkAuth();
    }
  }, [activeAccount]);

  const handleHederaSignMessage = async () => {
    if (!hederaService || !accountId) {
      toast({
        title: "Connection Required",
        description: "Please connect your Hedera wallet first using HashPack.",
        variant: "destructive",
      });
      return;
    }

    try {
      const message = `Sign to access Modred dashboard for account ${accountId} at ${Date.now()}`;
      const signature = await hederaService.signMessage(message, accountId);
      localStorage.setItem("signed_message", signature);
      localStorage.setItem("authToken", JSON.stringify({ address: accountId, chain: "hedera" }));
      document.cookie = `auth-token=${accountId}; path=/; max-age=86400`;
      setAuthType("hedera");
      setIsAuthenticated(true);
      toast({
        title: "Authentication Successful",
        description: "You can now access the dashboard with your Hedera wallet.",
      });
    } catch (error) {
      toast({
        title: "Hedera Authentication Failed",
        description: `Failed to sign message: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-heading">Authenticate to Access Dashboard</CardTitle>
              <CardDescription>
                Connect a wallet or use email verification to access the IP management dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {accountId && authType === "hedera" ? (
                <Button onClick={handleHederaSignMessage}>Sign Message with Hedera</Button>
              ) : (
                <MultiWalletConnectButton />
              )}
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  return <>{children}</>;
}