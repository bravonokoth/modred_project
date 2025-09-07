"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useHederaWallet } from "./hedera-wallet-provider"
import { usePaymentWallet } from "./payment-wallet-provider"
import { CheckCircle, AlertCircle, Wallet, DollarSign } from "lucide-react"

export function WalletConnectionStatus() {
  const [authInfo, setAuthInfo] = useState<any>(null)
  const { accountId, isConnected: hederaConnected, isInitialized } = useHederaWallet()
  const { balance } = usePaymentWallet()

  useEffect(() => {
    const authToken = localStorage.getItem("authToken")
    if (authToken) {
      try {
        setAuthInfo(JSON.parse(authToken))
      } catch (error) {
        console.error("Failed to parse auth token:", error)
      }
    }
  }, [])

  const getConnectionStatus = () => {
    if (!authInfo) return { status: "disconnected", message: "No wallet connected" }
    
    if (authInfo.chain === "hedera") {
      if (!isInitialized) return { status: "initializing", message: "Hedera wallet initializing..." }
      if (hederaConnected && accountId) return { status: "connected", message: "Hedera wallet connected" }
      return { status: "error", message: "Hedera wallet connection failed" }
    }
    
    if (authInfo.chain === "dummy" || authInfo.chain === "email") {
      return { status: "connected", message: "Dummy login active" }
    }
    
    return { status: "connected", message: `${authInfo.chain} wallet connected` }
  }

  const connectionStatus = getConnectionStatus()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "initializing":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-500">Connected</Badge>
      case "initializing":
        return <Badge variant="secondary">Initializing</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Disconnected</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connection Status
        </CardTitle>
        <CardDescription>Current wallet and payment status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(connectionStatus.status)}
            <span className="text-sm">{connectionStatus.message}</span>
          </div>
          {getStatusBadge(connectionStatus.status)}
        </div>

        {authInfo && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Address:</span>
              <span className="font-mono text-xs">
                {authInfo.chain === "dummy" || authInfo.chain === "email" 
                  ? authInfo.address 
                  : `${authInfo.address.slice(0, 8)}...${authInfo.address.slice(-6)}`
                }
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Chain:</span>
              <span className="capitalize">{authInfo.chain}</span>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm">Hosted Wallet</span>
            </div>
            <Badge className="bg-green-500">Active</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Balance:</span>
            <span className="font-semibold">${balance.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}