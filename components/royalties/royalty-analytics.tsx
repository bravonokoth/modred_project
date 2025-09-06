"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, DollarSign, Users, Calendar } from "lucide-react"

interface RoyaltyAnalyticsProps {
  period: string
}

// Mock data for analytics
const monthlyData = [
  { month: "Jul", earnings: 1.2, licenses: 3 },
  { month: "Aug", earnings: 1.8, licenses: 5 },
  { month: "Sep", earnings: 2.1, licenses: 7 },
  { month: "Oct", earnings: 2.8, licenses: 9 },
  { month: "Nov", earnings: 2.4, licenses: 8 },
  { month: "Dec", earnings: 3.2, licenses: 12 },
  { month: "Jan", earnings: 3.8, licenses: 15 },
]

const assetBreakdown = [
  { name: "Mobile App Design", value: 35.2, earnings: 4.523, color: "#0891b2" },
  { name: "AI Algorithm", value: 30.3, earnings: 3.891, color: "#6366f1" },
  { name: "Music Library", value: 16.8, earnings: 2.156, color: "#8b5cf6" },
  { name: "Logo Collection", value: 11.2, earnings: 1.445, color: "#06b6d4" },
  { name: "Photography", value: 6.5, earnings: 0.832, color: "#10b981" },
]

const licenseTypeData = [
  { type: "Non-Exclusive", count: 28, revenue: 8.2 },
  { type: "Exclusive", count: 5, revenue: 3.8 },
  { type: "Limited", count: 12, revenue: 2.1 },
]

export function RoyaltyAnalytics({ period }: RoyaltyAnalyticsProps) {
  const formatEth = (amount: number) => `${amount.toFixed(3)} ETH`

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18.5%</div>
            <p className="text-xs text-green-600">Consistent upward trend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Licenses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Across 12 IP assets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Royalty Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2%</div>
            <p className="text-xs text-muted-foreground">Weighted average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">License Duration</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18mo</div>
            <p className="text-xs text-muted-foreground">Average license length</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Earnings Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Earnings Trend</CardTitle>
            <CardDescription>Monthly royalty earnings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} ETH`, "Earnings"]} />
                <Line type="monotone" dataKey="earnings" stroke="#0891b2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* License Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">License Activity</CardTitle>
            <CardDescription>New licenses issued per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [value, "Licenses"]} />
                <Bar dataKey="licenses" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Asset Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Revenue by Asset</CardTitle>
            <CardDescription>Distribution of earnings across your IP portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {assetBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* License Types */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">License Type Performance</CardTitle>
            <CardDescription>Revenue and count by license type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {licenseTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{item.type}</p>
                    <p className="text-sm text-muted-foreground">{item.count} active licenses</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatEth(item.revenue)}</p>
                    <Badge variant="outline" className="text-xs">
                      {((item.revenue / 14.1) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Performance Insights</CardTitle>
          <CardDescription>AI-powered insights about your royalty performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-700 dark:text-green-300">Strong Performance</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your Mobile App Design System is outperforming similar assets by 23%. Consider creating more
                design-related IP.
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-700 dark:text-blue-300">Optimization Opportunity</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Your average royalty rate is below market average. Consider adjusting rates for new licenses.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
