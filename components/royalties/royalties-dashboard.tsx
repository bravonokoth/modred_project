"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EarningsOverview } from "./earnings-overview"
import { PaymentHistory } from "./payment-history"
import { RoyaltyAnalytics } from "./royalty-analytics"
import { PayoutSettings } from "./payout-settings"
import { AssetPerformance } from "./asset-performance"
import { Download } from "lucide-react"

export function RoyaltiesDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [selectedTab, setSelectedTab] = useState("overview")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-heading font-bold text-2xl">Royalties Dashboard</h2>
          <p className="text-muted-foreground">Monitor your IP earnings and manage payouts</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <EarningsOverview period={selectedPeriod} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <RoyaltyAnalytics period={selectedPeriod} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <AssetPerformance period={selectedPeriod} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <PaymentHistory period={selectedPeriod} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <PayoutSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
