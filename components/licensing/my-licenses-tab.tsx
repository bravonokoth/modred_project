"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, DollarSign, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

// Mock data for user's licenses
const mockLicenses = {
  active: [
    {
      id: "1",
      assetTitle: "Mobile App Design System",
      licenseType: "Non-Exclusive",
      owner: "0x1234...5678",
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      price: "0.5 ETH",
      royaltyRate: "5%",
      territory: "Worldwide",
      status: "active",
    },
    {
      id: "2",
      assetTitle: "Music Composition Library",
      licenseType: "Limited",
      owner: "0x5432...8765",
      startDate: "2024-02-01",
      endDate: "2024-08-01",
      price: "0.3 ETH",
      royaltyRate: "8%",
      territory: "North America",
      status: "active",
    },
  ],
  pending: [
    {
      id: "3",
      assetTitle: "AI Algorithm Patent",
      licenseType: "Exclusive",
      owner: "0x8765...4321",
      requestDate: "2024-01-20",
      price: "2.0 ETH",
      royaltyRate: "10%",
      territory: "Europe",
      status: "pending",
    },
  ],
  expired: [
    {
      id: "4",
      assetTitle: "Photography Portfolio",
      licenseType: "Non-Exclusive",
      owner: "0x1357...2468",
      startDate: "2023-06-01",
      endDate: "2024-01-01",
      price: "0.2 ETH",
      royaltyRate: "6%",
      territory: "Worldwide",
      status: "expired",
    },
  ],
}

export function MyLicensesTab() {
  const [selectedTab, setSelectedTab] = useState("active")

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "expired":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const renderLicenseCard = (license: any) => (
    <Card key={license.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="font-heading text-lg">{license.assetTitle}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">{license.owner.slice(2, 4).toUpperCase()}</AvatarFallback>
              </Avatar>
              {formatAddress(license.owner)}
            </CardDescription>
          </div>
          {getStatusBadge(license.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Type:</span>
              <span>{license.licenseType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Price:</span>
              <span>{license.price}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Royalty:</span>
              <span>{license.royaltyRate}</span>
            </div>
          </div>
          <div className="space-y-2">
            {license.startDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Period:</span>
                <span>
                  {license.startDate} - {license.endDate}
                </span>
              </div>
            )}
            {license.requestDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Requested:</span>
                <span>{license.requestDate}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Territory:</span>
              <span>{license.territory}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getStatusIcon(license.status)}
            <span className="text-sm text-muted-foreground capitalize">{license.status}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            {license.status === "active" && (
              <Button variant="outline" size="sm">
                Manage
              </Button>
            )}
            {license.status === "expired" && <Button size="sm">Renew</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">My Licenses</CardTitle>
          <CardDescription>Manage your licensed IP assets and track their status</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({mockLicenses.active.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({mockLicenses.pending.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({mockLicenses.expired.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {mockLicenses.active.length > 0 ? (
            mockLicenses.active.map(renderLicenseCard)
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">No Active Licenses</h3>
                <p className="text-muted-foreground">
                  You don't have any active licenses yet. Browse the marketplace to find IP assets to license.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {mockLicenses.pending.length > 0 ? (
            mockLicenses.pending.map(renderLicenseCard)
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">No Pending Requests</h3>
                <p className="text-muted-foreground">You don't have any pending license requests at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          {mockLicenses.expired.length > 0 ? (
            mockLicenses.expired.map(renderLicenseCard)
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">No Expired Licenses</h3>
                <p className="text-muted-foreground">You don't have any expired licenses in your history.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
