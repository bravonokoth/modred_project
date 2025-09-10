import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WalletConnect } from "./components/WalletConnect"
import { WalletBalance } from "./components/WalletBalance"
import { WalletSelector } from "./components/WalletSelector"
import { Wallet, Shield, Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function WalletPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-heading font-bold text-2xl">Wallet Management</h2>
          <p className="text-muted-foreground">Connect and manage wallets across multiple blockchains</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

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
  )
}