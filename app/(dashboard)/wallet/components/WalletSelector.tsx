"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Plus, CheckCircle, Clock } from "lucide-react"

// Available wallets configuration
const availableWallets = [
  {
    id: "metamask",
    name: "MetaMask",
    chain: "Ethereum",
    icon: "🦊",
    status: "connected",
    description: "Most popular Ethereum wallet",
  },
  {
    id: "hashpack",
    name: "HashPack", 
    chain: "Hedera",
    icon: "🔷",
    status: "connected",
    description: "Official Hedera wallet",
  },
  {
    id: "phantom",
    name: "Phantom",
    chain: "Solana", 
    icon: "👻",
    status: "available",
    description: "Leading Solana wallet",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    chain: "Multi-chain",
    icon: "🔵",
    status: "available", 
    description: "Secure multi-chain wallet",
  },
  {
    id: "trust",
    name: "Trust Wallet",
    chain: "Multi-chain",
    icon: "🛡️",
    status: "available",
    description: "Mobile-first wallet",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    chain: "Multi-chain",
    icon: "🔗",
    status: "available",
    description: "Connect any wallet",
  },
  {
    id: "rainbow",
    name: "Rainbow",
    chain: "Ethereum",
    icon: "🌈",
    status: "available",
    description: "Beautiful Ethereum wallet",
  },
  {
    id: "brave",
    name: "Brave Wallet",
    chain: "Multi-chain", 
    icon: "🦁",
    status: "available",
    description: "Built into Brave browser",
  },
  {
    id: "exodus",
    name: "Exodus",
    chain: "Multi-chain",
    icon: "💎",
    status: "available",
    description: "Desktop & mobile wallet",
  },
  {
    id: "ledger",
    name: "Ledger Live",
    chain: "Multi-chain",
    icon: "🔐",
    status: "available",
    description: "Hardware wallet security",
  },
]

export function WalletSelector() {
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null)

  const handleConnect = async (walletId: string) => {
    setConnectingWallet(walletId)
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update wallet status (in real app, this would update global state)
      console.log(`Connected to ${walletId}`)
    } catch (error) {
      console.error(`Failed to connect to ${walletId}:`, error)
    } finally {
      setConnectingWallet(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-500">Connected</Badge>
      case "connecting":
        return <Badge variant="secondary">Connecting...</Badge>
      default:
        return <Badge variant="outline">Available</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "connecting":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Plus className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Available Wallets</CardTitle>
        <CardDescription>Connect wallets from different blockchain networks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {availableWallets.map((wallet) => {
            const isConnecting = connectingWallet === wallet.id
            const status = isConnecting ? "connecting" : wallet.status

            return (
              <div key={wallet.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{wallet.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{wallet.name}</p>
                      <Badge variant="outline" className="text-xs">{wallet.chain}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{wallet.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(status)}
                  {wallet.status === "available" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConnect(wallet.id)}
                      disabled={isConnecting}
                    >
                      {getStatusIcon(status)}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Each wallet requires its respective browser extension or mobile app to be installed.
            Hardware wallets require additional setup.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}