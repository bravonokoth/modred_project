"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiWalletConnectButton } from "./multi-wallet-connect-button";
import { Wallet } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const authToken = localStorage.getItem("authToken");
    const cookieAuth = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="));

    setIsAuthenticated(!!(authToken || cookieAuth));
    setIsLoading(false);
  }, []);

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
              <CardTitle className="font-heading">Connect Your Wallet</CardTitle>
              <CardDescription>
                Connect a wallet or use dummy login to access the dashboard and IP management features.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <MultiWalletConnectButton />
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  return <>{children}</>;
}