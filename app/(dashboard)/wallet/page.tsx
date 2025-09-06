import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WalletConnect } from "./components/WalletConnect"
import { WalletBalance } from "./components/WalletBalance"
import { WalletSelector } from "./components/WalletSelector"
import { Wallet, Shield, Zap } from "lucide-react"

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Wallet className="h-3 w-3 mr-1" />
              Multi-Chain Wallet Management
            </Badge>
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-2">Wallet Management</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect and manage wallets across multiple blockchains for seamless IP transactions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <WalletConnect />
            <WalletBalance />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <WalletSelector />
            
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Supported Networks</CardTitle>
                <CardDescription>Blockchains available for IP management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Hedera Hashgraph</p>
                    <p className="text-xs text-muted-foreground">Fast, secure, and energy-efficient</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Ethereum</p>
                    <p className="text-xs text-muted-foreground">Largest smart contract ecosystem</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Solana</p>
                    <p className="text-xs text-muted-foreground">High-speed, low-cost transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}