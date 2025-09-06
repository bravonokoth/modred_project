"use client"

import type React from "react"
import { useHederaWallet } from "./hedera-wallet-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HederaWalletConnectButton } from "./hedera-wallet-connect-button"
import { Wallet } from "lucide-react"

interface HederaWalletGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function HederaWalletGuard({ children, fallback }: HederaWalletGuardProps) {
  const { isConnected } = useHederaWallet()

  if (!isConnected) {
    return (
      fallback || (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-heading">Connect Your Hedera Wallet</CardTitle>
              <CardDescription>
                Connect your Hedera wallet to access IP management features and interact with the Hedera network.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <HederaWalletConnectButton />
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  return <>{children}</>
}
