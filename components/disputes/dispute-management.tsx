"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DisputeCard } from "./dispute-card"
import { CreateDisputeDialog } from "./create-dispute-dialog"
import { DisputeDetailDialog } from "./dispute-detail-dialog"
import { AlertTriangle, Plus, Shield, Clock, CheckCircle, XCircle } from "lucide-react"

// Mock data for disputes
const mockDisputes = {
  filed: [
    {
      id: "1",
      title: "Unauthorized Use of Design System",
      description: "Company X is using our mobile app design system without proper licensing",
      defendant: "0x8765...4321",
      ipAsset: "Mobile App Design System",
      status: "under-review",
      priority: "high",
      filedDate: "2024-01-20",
      lastUpdate: "2024-01-22",
      evidence: 3,
      responses: 1,
      category: "copyright-infringement",
    },
    {
      id: "2",
      title: "Patent Infringement Claim",
      description: "Competitor is using our patented AI algorithm in their product",
      defendant: "0x1234...9876",
      ipAsset: "AI Algorithm Patent",
      status: "awaiting-response",
      priority: "critical",
      filedDate: "2024-01-18",
      lastUpdate: "2024-01-21",
      evidence: 5,
      responses: 0,
      category: "patent-infringement",
    },
  ],
  received: [
    {
      id: "3",
      title: "Trademark Similarity Dispute",
      description: "Claim that our logo is too similar to existing trademark",
      plaintiff: "0x5432...1098",
      ipAsset: "Brand Logo Collection",
      status: "response-required",
      priority: "medium",
      filedDate: "2024-01-19",
      lastUpdate: "2024-01-20",
      evidence: 2,
      responses: 0,
      category: "trademark-dispute",
      dueDate: "2024-01-26",
    },
  ],
  resolved: [
    {
      id: "4",
      title: "Music Copyright Dispute",
      description: "Resolved dispute over music composition usage rights",
      defendant: "0x9876...5432",
      ipAsset: "Music Composition Library",
      status: "resolved-settlement",
      priority: "low",
      filedDate: "2023-12-15",
      lastUpdate: "2024-01-10",
      evidence: 4,
      responses: 3,
      category: "copyright-infringement",
      resolution: "Settlement reached - $500 compensation",
    },
  ],
}

export function DisputeManagement() {
  const [selectedTab, setSelectedTab] = useState("filed")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedDispute, setSelectedDispute] = useState<any>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const handleViewDispute = (dispute: any) => {
    setSelectedDispute(dispute)
    setShowDetailDialog(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "under-review":
      case "awaiting-response":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "response-required":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "resolved-settlement":
      case "resolved-dismissed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "escalated":
        return <Shield className="h-4 w-4 text-red-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "secondary"
      case "medium":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-heading font-bold text-2xl">Dispute Management</h2>
          <p className="text-muted-foreground">Track and manage your IP disputes</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          File New Dispute
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Filed by Me</p>
                <p className="text-2xl font-bold">{mockDisputes.filed.length}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Against Me</p>
                <p className="text-2xl font-bold">{mockDisputes.received.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{mockDisputes.resolved.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold">
                  {[...mockDisputes.filed, ...mockDisputes.received].filter((d) => d.priority === "critical").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="filed">Filed by Me ({mockDisputes.filed.length})</TabsTrigger>
          <TabsTrigger value="received">Against Me ({mockDisputes.received.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({mockDisputes.resolved.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="filed" className="space-y-4">
          {mockDisputes.filed.length > 0 ? (
            mockDisputes.filed.map((dispute) => (
              <DisputeCard key={dispute.id} dispute={dispute} type="filed" onView={() => handleViewDispute(dispute)} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">No Disputes Filed</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't filed any IP disputes yet. If someone is infringing on your intellectual property, you can
                  file a dispute.
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  File Your First Dispute
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {mockDisputes.received.length > 0 ? (
            mockDisputes.received.map((dispute) => (
              <DisputeCard
                key={dispute.id}
                dispute={dispute}
                type="received"
                onView={() => handleViewDispute(dispute)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">No Disputes Against You</h3>
                <p className="text-muted-foreground">Great! No one has filed any disputes against your IP assets.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {mockDisputes.resolved.length > 0 ? (
            mockDisputes.resolved.map((dispute) => (
              <DisputeCard
                key={dispute.id}
                dispute={dispute}
                type="resolved"
                onView={() => handleViewDispute(dispute)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">No Resolved Disputes</h3>
                <p className="text-muted-foreground">
                  Your dispute resolution history will appear here once disputes are resolved.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateDisputeDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <DisputeDetailDialog dispute={selectedDispute} open={showDetailDialog} onOpenChange={setShowDetailDialog} />
    </div>
  )
}
