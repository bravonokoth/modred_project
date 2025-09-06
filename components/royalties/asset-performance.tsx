"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, Users, Eye, MoreHorizontal } from "lucide-react"

interface AssetPerformanceProps {
  period: string
}

// Mock data for asset performance
const assetPerformance = [
  {
    id: "1",
    name: "Mobile App Design System",
    type: "Design",
    totalEarnings: 4.523,
    monthlyEarnings: 0.892,
    activeLicenses: 12,
    royaltyRate: 5,
    growth: 18.5,
    views: 1247,
    conversionRate: 9.6,
    status: "active",
  },
  {
    id: "2",
    name: "AI Algorithm Patent",
    type: "Patent",
    totalEarnings: 3.891,
    monthlyEarnings: 0.756,
    activeLicenses: 3,
    royaltyRate: 10,
    growth: 12.3,
    views: 892,
    conversionRate: 3.4,
    status: "active",
  },
  {
    id: "3",
    name: "Music Composition Library",
    type: "Copyright",
    totalEarnings: 2.156,
    monthlyEarnings: 0.445,
    activeLicenses: 18,
    royaltyRate: 8,
    growth: -5.2,
    views: 2156,
    conversionRate: 8.3,
    status: "active",
  },
  {
    id: "4",
    name: "Brand Logo Collection",
    type: "Trademark",
    totalEarnings: 1.445,
    monthlyEarnings: 0.234,
    activeLicenses: 25,
    royaltyRate: 3,
    growth: 8.7,
    views: 3421,
    conversionRate: 7.3,
    status: "active",
  },
  {
    id: "5",
    name: "Photography Portfolio",
    type: "Copyright",
    totalEarnings: 0.832,
    monthlyEarnings: 0.156,
    activeLicenses: 45,
    royaltyRate: 6,
    growth: 22.1,
    views: 5678,
    conversionRate: 7.9,
    status: "active",
  },
]

export function AssetPerformance({ period }: AssetPerformanceProps) {
  const formatEth = (amount: number) => `${amount.toFixed(3)} ETH`
  const formatUsd = (amount: number) => `$${(amount * 2400).toLocaleString()}`

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Mobile App Design System</div>
            <p className="text-xs text-muted-foreground">+18.5% growth this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Licensed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Photography Portfolio</div>
            <p className="text-xs text-muted-foreground">45 active licenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">AI Algorithm Patent</div>
            <p className="text-xs text-muted-foreground">10% royalty rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Asset Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Asset Performance Details</CardTitle>
          <CardDescription>Detailed performance metrics for each of your IP assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assetPerformance.map((asset) => (
              <Card key={asset.id} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading font-semibold text-lg">{asset.name}</h3>
                        <Badge variant="outline">{asset.type}</Badge>
                        <Badge variant={asset.growth > 0 ? "default" : "secondary"} className="text-xs">
                          {asset.growth > 0 ? "+" : ""}
                          {asset.growth}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Earnings</p>
                          <p className="font-semibold">{formatEth(asset.totalEarnings)}</p>
                          <p className="text-xs text-muted-foreground">{formatUsd(asset.totalEarnings)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Monthly</p>
                          <p className="font-semibold">{formatEth(asset.monthlyEarnings)}</p>
                          <div className="flex items-center gap-1">
                            {asset.growth > 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                            <span className={`text-xs ${asset.growth > 0 ? "text-green-500" : "text-red-500"}`}>
                              {Math.abs(asset.growth)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Active Licenses</p>
                          <p className="font-semibold">{asset.activeLicenses}</p>
                          <p className="text-xs text-muted-foreground">{asset.royaltyRate}% royalty</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Performance</p>
                          <div className="flex items-center gap-2">
                            <Eye className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{asset.views.toLocaleString()} views</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{asset.conversionRate}% conversion</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Performance Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Performance Score</span>
                      <span>{Math.round((asset.conversionRate + asset.growth + 10) * 2)}%</span>
                    </div>
                    <Progress value={Math.round((asset.conversionRate + asset.growth + 10) * 2)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Optimization Recommendations</CardTitle>
          <CardDescription>AI-powered suggestions to improve your asset performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Music Composition Library</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                Performance declined by 5.2% this month. Consider updating the library with new compositions or
                adjusting pricing.
              </p>
              <Button size="sm" variant="outline">
                View Suggestions
              </Button>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Photography Portfolio</h4>
              <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                High license volume with good conversion rate. Consider creating similar content or increasing royalty
                rates.
              </p>
              <Button size="sm" variant="outline">
                Explore Opportunities
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
