"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { hederaService } from "@/lib/blockchain/hedera/hedera-service";
import { MultiWalletConnectButton } from "./multi-wallet-connect-button";
import { useActiveAccount, useActiveWallet } from "thirdweb/react"; // v5 import
import { useToast } from "@/hooks/use-toast";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hederaServiceReady, setHederaServiceReady] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [authType, setAuthType] = useState<
    "hedera" | "metamask" | "email" | "trustwallet" | "walletconnect" | "coinbase" | "rainbow" | "zerion" | "okx" | "binance" | null
  >(null);
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHederaServiceReady(true);

      const checkAuth = async () => {
        // Check for auth token cookie (standardized format)
        const cookieAuth = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth-token="));
        
        const authToken = localStorage.getItem("authToken");
        
        // Check Hedera authentication - require both connection AND signature
        const hederaAccountId = hederaService.getAccountId();
        const hederaSignedMessage = localStorage.getItem("signed_message");
        
        if (hederaAccountId && hederaSignedMessage && cookieAuth) {
          setAccountId(hederaAccountId);
          setAuthType("hedera");
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        // For Hedera, if connected but not signed, show sign button
        if (hederaAccountId && !hederaSignedMessage) {
          setAccountId(hederaAccountId);
          setAuthType("hedera");
          setIsAuthenticated(false); // Not fully authenticated until signed
          setIsLoading(false);
          return;
        }

        // Check Thirdweb authentication (MetaMask, email, etc.)
        if (activeAccount && authToken && cookieAuth) {
          try {
            const { address, chain } = JSON.parse(authToken);
            setAccountId(address);
            setAuthType(chain as typeof authType);
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          } catch (error) {
            console.warn("Failed to parse auth token:", error);
          }
        }

        setIsLoading(false);
      };

      checkAuth();
    }
  }, [activeAccount]);

  const handleHederaSignMessage = async () => {
    if (!hederaServiceReady || !accountId) {
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
      
      // Store signature and set proper auth tokens
      localStorage.setItem("signed_message", signature);
      const authToken = JSON.stringify({ address: accountId, chain: "hedera", signed: true, timestamp: Date.now() });
      localStorage.setItem("authToken", authToken);
      
      // Set standardized cookie format
      document.cookie = `auth-token=${btoa(authToken)}; path=/; max-age=86400`;
      
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