"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MultiWalletConnectButton } from "@/components/wallet/multi-wallet-connect-button"
import { Wallet, Shield, CheckCircle, AlertCircle } from "lucide-react"

// Mock connected wallets data
const mockConnectedWallets = [
  {
    id: "1",
    name: "MetaMask",
    chain: "Ethereum",
    address: "0x1234567890123456789012345678901234567890",
    balance: "2.456 ETH",
    status: "connected",
  },
  {
    id: "2", 
    name: "HashPack",
    chain: "Hedera",
    address: "0.0.123456",
    balance: "1,250 HBAR",
    status: "connected",
  },
]

export function WalletConnect() {
  const [connectedWallets, setConnectedWallets] = useState(mockConnectedWallets)

  const formatAddress = (address: string, chain: string) => {
    if (chain === "Hedera") {
      return address // Hedera addresses are already short
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getChainColor = (chain: string) => {
    switch (chain) {
      case "Ethereum":
        return "bg-blue-500"
      case "Hedera":
        return "bg-purple-500"
      case "Solana":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connected Wallets
        </CardTitle>
        <CardDescription>Manage your connected wallets across different blockchains</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connected Wallets */}
        {connectedWallets.length > 0 ? (
          <div className="space-y-4">
            {connectedWallets.map((wallet) => (
              <div key={wallet.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getChainColor(wallet.chain)}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{wallet.name}</p>
                      <Badge variant="outline" className="text-xs">{wallet.chain}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatAddress(wallet.address, wallet.chain)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="font-semibold text-sm">{wallet.balance}</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">Connected</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-lg mb-2">No Wallets Connected</h3>
            <p className="text-muted-foreground mb-4">
              Connect your first wallet to start managing your IP assets on the blockchain.
            </p>
          </div>
        )}

        {/* Connect New Wallet */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Connect Additional Wallet</h4>
            <Badge variant="secondary">Multi-Chain Support</Badge>
          </div>
          <MultiWalletConnectButton />
        </div>

        {/* Security Notice */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">Security Notice</h4>
              <p className="text-xs text-muted-foreground">
                Your private keys are never stored on our servers. All wallet connections are secured through 
                official wallet extensions and protocols.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}