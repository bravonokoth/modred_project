"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, Wallet, Clock, CheckCircle } from "lucide-react"

interface EarningsOverviewProps {
  period: string
}

// Mock data for earnings
const mockEarnings = {
  total: 12.847,
  pending: 2.156,
  paid: 10.691,
  thisMonth: 3.245,
  lastMonth: 2.891,
  growth: 12.2,
  topAssets: [
    { name: "Mobile App Design System", earnings: 4.523, percentage: 35.2 },
    { name: "AI Algorithm Patent", earnings: 3.891, percentage: 30.3 },
    { name: "Music Composition Library", earnings: 2.156, percentage: 16.8 },
    { name: "Brand Logo Collection", earnings: 1.445, percentage: 11.2 },
    { name: "Photography Portfolio", earnings: 0.832, percentage: 6.5 },
  ],
  recentPayments: [
    { id: "1", asset: "Mobile App Design System", amount: 0.523, date: "2024-01-22", status: "completed" },
    { id: "2", asset: "AI Algorithm Patent", amount: 0.891, date: "2024-01-20", status: "completed" },
    { id: "3", asset: "Music Composition Library", amount: 0.256, date: "2024-01-18", status: "pending" },
  ],
}

export function EarningsOverview({ period }: EarningsOverviewProps) {
  const formatEth = (amount: number) => `${amount.toFixed(3)} ETH`
  const formatUsd = (amount: number) => `$${(amount * 2400).toLocaleString()}`

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEth(mockEarnings.total)}</div>
            <p className="text-xs text-muted-foreground">{formatUsd(mockEarnings.total)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEth(mockEarnings.pending)}</div>
            <p className="text-xs text-muted-foreground">{formatUsd(mockEarnings.pending)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEth(mockEarnings.thisMonth)}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />+{mockEarnings.growth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available to Withdraw</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEth(mockEarnings.pending)}</div>
            <Button size="sm" className="mt-2 w-full">
              Withdraw
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Performing Assets */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Top Performing Assets</CardTitle>
              <CardDescription>Your highest earning IP assets this {period}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEarnings.topAssets.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.percentage}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatEth(asset.earnings)}</p>
                      <p className="text-xs text-muted-foreground">{formatUsd(asset.earnings)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Recent Payments</CardTitle>
              <CardDescription>Latest royalty payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEarnings.recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {payment.status === "completed" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{payment.asset}</p>
                        <p className="text-xs text-muted-foreground">{payment.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatEth(payment.amount)}</p>
                      <Badge variant={payment.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="font-heading">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                <Wallet className="h-4 w-4 mr-2" />
                Withdraw Earnings
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                <DollarSign className="h-4 w-4 mr-2" />
                Payment History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Earnings Breakdown</CardTitle>
          <CardDescription>Distribution of your royalty income</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Paid Out</span>
              <span className="font-medium">{formatEth(mockEarnings.paid)} (83.2%)</span>
            </div>
            <Progress value={83.2} className="h-2" />

            <div className="flex items-center justify-between">
              <span className="text-sm">Pending</span>
              <span className="font-medium">{formatEth(mockEarnings.pending)} (16.8%)</span>
            </div>
            <Progress value={16.8} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
