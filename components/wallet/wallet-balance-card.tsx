"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePaymentWallet } from "./payment-wallet-provider"
import { DollarSign, Plus, ArrowUpRight, ArrowDownLeft, History } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function WalletBalanceCard() {
  const { balance, isLoading, addFunds, getTransactionHistory } = usePaymentWallet()
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [addAmount, setAddAmount] = useState("")

  const handleAddFunds = async () => {
    const amount = parseFloat(addAmount)
    if (amount > 0) {
      const success = await addFunds(amount)
      if (success) {
        setShowAddFunds(false)
        setAddAmount("")
      }
    }
  }

  const transactions = getTransactionHistory()

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Wallet Balance
          </CardTitle>
          <CardDescription>Your available funds for IP purchases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Available Balance</p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowAddFunds(true)}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Funds
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowHistory(true)}
            >
              <History className="h-4 w-4 mr-1" />
              History
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Secure hosted wallet solution for seamless IP transactions
          </div>
        </CardContent>
      </Card>

      {/* Add Funds Dialog */}
      <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
            <DialogDescription>
              Add money to your wallet for IP purchases
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="1"
                placeholder="0.00"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddFunds(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddFunds}
                disabled={isLoading || !addAmount || parseFloat(addAmount) <= 0}
                className="flex-1"
              >
                Add Funds
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
            <DialogDescription>
              Your recent wallet transactions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  {tx.type === "deposit" ? (
                    <ArrowDownLeft className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.timestamp.toLocaleDateString()} {tx.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {tx.type === "deposit" ? "+" : "-"}${tx.amount.toFixed(2)}
                  </p>
                  <Badge variant={tx.status === "completed" ? "default" : "secondary"} className="text-xs">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}