"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePaymentWallet } from "@/components/wallet/payment-wallet-provider"
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react"
import { multiChainService } from "@/lib/blockchain/multi-chain"

// Mock balance data
const mockBalances = {
  ethereum: {
    native: { symbol: "ETH", amount: 2.456, usdValue: 5894.40 },
    tokens: [
      { symbol: "USDC", amount: 1250.00, usdValue: 1250.00 },
      { symbol: "LINK", amount: 45.67, usdValue: 678.90 },
    ]
  },
  hedera: {
    native: { symbol: "HBAR", amount: 1250.00, usdValue: 87.50 },
    tokens: [
      { symbol: "SAUCE", amount: 500.00, usdValue: 25.00 },
    ]
  },
  solana: {
    native: { symbol: "SOL", amount: 12.34, usdValue: 1234.00 },
    tokens: [
      { symbol: "USDC", amount: 800.00, usdValue: 800.00 },
    ]
  }
}

// Mock transaction history
const mockTransactions = [
  {
    id: "1",
    type: "receive",
    amount: "0.523 ETH",
    from: "IP Royalty Payment",
    date: "2024-01-22",
    status: "completed",
    hash: "0xabc123...def456",
  },
  {
    id: "2",
    type: "send", 
    amount: "0.1 ETH",
    to: "License Purchase",
    date: "2024-01-20",
    status: "completed",
    hash: "0xdef456...ghi789",
  },
  {
    id: "3",
    type: "receive",
    amount: "125 HBAR",
    from: "IP Registration Fee Refund",
    date: "2024-01-18",
    status: "completed",
    hash: "0.0.123456@1642567890.123456789",
  },
]

export function WalletBalance() {
  const [selectedChain, setSelectedChain] = useState("ethereum")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { balance: hostedBalance } = usePaymentWallet()
  const [hederaBalance, setHederaBalance] = useState<any>(null)

  useEffect(() => {
    // Check if Hedera is connected and get balance
    const hederaAccountId = localStorage.getItem("hedera_account_id")
    if (hederaAccountId) {
      const fetchHederaBalance = async () => {
        try {
          const balance = await multiChainService.getBalance("hedera", hederaAccountId)
          setHederaBalance(balance)
        } catch (error) {
          console.error("Failed to fetch Hedera balance:", error)
        }
      }
      fetchHederaBalance()
    }
  }, [])
  const refreshBalances = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const getTotalUsdValue = () => {
    return Object.values(mockBalances).reduce((total, chain) => {
      const nativeValue = chain.native.usdValue
      const tokenValue = chain.tokens.reduce((sum, token) => sum + token.usdValue, 0)
      return total + nativeValue + tokenValue
    }, 0) + (hederaBalance?.native?.usdValue || 0)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-heading flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Portfolio Balance
            </CardTitle>
            <CardDescription>Your assets across all connected wallets</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshBalances} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Total Portfolio Value */}
        <div className="mb-6 p-4 bg-primary/5 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
            <p className="text-3xl font-bold">${(getTotalUsdValue() + hostedBalance).toLocaleString()}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">+12.5% (24h)</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Includes ${hostedBalance.toFixed(2)} in hosted wallet
            </div>
          </div>
        </div>

        <Tabs value={selectedChain} onValueChange={setSelectedChain}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
            <TabsTrigger value="hedera">
              Hedera
              {localStorage.getItem("hedera_account_id") && (
                <div className="ml-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="solana">Solana</TabsTrigger>
          </TabsList>

          <TabsContent value="hedera" className="space-y-4">
            {hederaBalance ? (
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="font-medium">{hederaBalance.native.symbol}</span>
                  </div>
                  <Badge variant="secondary">Native</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{hederaBalance.native.amount.toFixed(3)} {hederaBalance.native.symbol}</p>
                    <p className="text-sm text-muted-foreground">${hederaBalance.native.usdValue.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                    <Button variant="outline" size="sm">
                      <ArrowDownLeft className="h-4 w-4 mr-1" />
                      Receive
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Connect your HashPack wallet to view Hedera balance</p>
              </div>
            )}
          </TabsContent>

          {Object.entries(mockBalances).filter(([chain]) => chain !== "hedera").map(([chain, data]) => (
            <TabsContent key={chain} value={chain} className="space-y-4">
              {/* Native Token */}
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      chain === 'ethereum' ? 'bg-blue-500' : 
                      chain === 'hedera' ? 'bg-purple-500' : 'bg-green-500'
                    }`} />
                    <span className="font-medium">{data.native.symbol}</span>
                  </div>
                  <Badge variant="secondary">Native</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{data.native.amount.toFixed(3)} {data.native.symbol}</p>
                    <p className="text-sm text-muted-foreground">${data.native.usdValue.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                    <Button variant="outline" size="sm">
                      <ArrowDownLeft className="h-4 w-4 mr-1" />
                      Receive
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tokens */}
              {data.tokens.map((token, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{token.symbol}</span>
                    <Badge variant="outline">Token</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">{token.amount.toLocaleString()} {token.symbol}</p>
                      <p className="text-sm text-muted-foreground">${token.usdValue.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* Recent Transactions */}
        <div className="mt-6">
          <h4 className="font-medium mb-4">Recent Transactions</h4>
          <div className="space-y-3">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  {tx.type === "receive" ? (
                    <ArrowDownLeft className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{tx.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.type === "receive" ? `From: ${tx.from}` : `To: ${tx.to}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{tx.date}</p>
                  <Badge variant="outline" className="text-xs">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}