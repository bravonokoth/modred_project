"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, AlertCircle, Search, Download } from "lucide-react"

interface PaymentHistoryProps {
  period: string
}

// Mock payment history data
const paymentHistory = [
  {
    id: "1",
    date: "2024-01-22",
    asset: "Mobile App Design System",
    licensee: "0x1234...5678",
    amount: 0.523,
    type: "royalty",
    status: "completed",
    txHash: "0xabc123...def456",
  },
  {
    id: "2",
    date: "2024-01-20",
    asset: "AI Algorithm Patent",
    licensee: "0x8765...4321",
    amount: 0.891,
    type: "royalty",
    status: "completed",
    txHash: "0xdef456...ghi789",
  },
  {
    id: "3",
    date: "2024-01-18",
    asset: "Music Composition Library",
    licensee: "0x5432...1098",
    amount: 0.256,
    type: "royalty",
    status: "pending",
    txHash: null,
  },
  {
    id: "4",
    date: "2024-01-15",
    asset: "Brand Logo Collection",
    licensee: "0x9876...5432",
    amount: 0.134,
    type: "royalty",
    status: "completed",
    txHash: "0xghi789...jkl012",
  },
  {
    id: "5",
    date: "2024-01-12",
    asset: "Photography Portfolio",
    licensee: "0x2468...1357",
    amount: 0.089,
    type: "royalty",
    status: "completed",
    txHash: "0xjkl012...mno345",
  },
  {
    id: "6",
    date: "2024-01-10",
    asset: "Mobile App Design System",
    licensee: "0x1357...2468",
    amount: 0.445,
    type: "royalty",
    status: "failed",
    txHash: null,
  },
  {
    id: "7",
    date: "2024-01-08",
    asset: "AI Algorithm Patent",
    licensee: "0x3691...4815",
    amount: 0.667,
    type: "royalty",
    status: "completed",
    txHash: "0xmno345...pqr678",
  },
  {
    id: "8",
    date: "2024-01-05",
    asset: "Music Composition Library",
    licensee: "0x1472...5836",
    amount: 0.223,
    type: "royalty",
    status: "completed",
    txHash: "0xpqr678...stu901",
  },
]

export function PaymentHistory({ period }: PaymentHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const formatEth = (amount: number) => `${amount.toFixed(3)} ETH`
  const formatUsd = (amount: number) => `$${(amount * 2400).toLocaleString()}`
  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredPayments = paymentHistory.filter((payment) => {
    const matchesSearch =
      payment.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.licensee.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesType = typeFilter === "all" || payment.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const completedAmount = filteredPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPayments.length}</div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEth(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">{formatUsd(totalAmount)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEth(completedAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {((completedAmount / totalAmount) * 100).toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Payment History</CardTitle>
          <CardDescription>Complete history of your royalty payments and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by asset name or licensee address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="royalty">Royalty</SelectItem>
                <SelectItem value="license">License</SelectItem>
                <SelectItem value="bonus">Bonus</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Payment List */}
          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(payment.status)}
                  <div>
                    <p className="font-medium text-sm">{payment.asset}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>From {formatAddress(payment.licensee)}</span>
                      <span>•</span>
                      <span>{payment.date}</span>
                      {payment.txHash && (
                        <>
                          <span>•</span>
                          <Button variant="link" className="h-auto p-0 text-xs" asChild>
                            <a
                              href={`https://etherscan.io/tx/${payment.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View TX
                            </a>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold">{formatEth(payment.amount)}</p>
                    <p className="text-xs text-muted-foreground">{formatUsd(payment.amount)}</p>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
              </div>
            ))}
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-lg mb-2">No payments found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or check back later for new payments.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
