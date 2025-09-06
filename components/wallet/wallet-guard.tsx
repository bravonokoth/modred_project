"use client"

import type React from "react"

import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletConnectButton } from "./wallet-connect-button"
import { Wallet } from "lucide-react"

interface WalletGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function WalletGuard({ children, fallback }: WalletGuardProps) {
  const { isConnected } = useAccount()

  if (!isConnected) {
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
                Connect your wallet to access IP management features and interact with the blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <WalletConnectButton />
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  return <>{children}</>
}
