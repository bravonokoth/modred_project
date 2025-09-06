"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, FileText, MessageSquare, Clock, AlertTriangle, CheckCircle, Shield } from "lucide-react"

interface DisputeCardProps {
  dispute: any
  type: "filed" | "received" | "resolved"
  onView: () => void
}

export function DisputeCard({ dispute, type, onView }: DisputeCardProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
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
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "under-review":
        return <Badge variant="secondary">Under Review</Badge>
      case "awaiting-response":
        return <Badge variant="outline">Awaiting Response</Badge>
      case "response-required":
        return <Badge className="bg-orange-500">Response Required</Badge>
      case "resolved-settlement":
        return <Badge className="bg-green-500">Resolved - Settlement</Badge>
      case "resolved-dismissed":
        return <Badge className="bg-green-500">Resolved - Dismissed</Badge>
      case "escalated":
        return <Badge variant="destructive">Escalated</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return (
          <Badge variant="destructive" className="text-xs">
            Critical
          </Badge>
        )
      case "high":
        return (
          <Badge variant="secondary" className="text-xs">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="text-xs">
            Medium
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        )
    }
  }

  const otherParty = type === "filed" ? dispute.defendant : dispute.plaintiff

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(dispute.status)}
              <CardTitle className="font-heading text-lg">{dispute.title}</CardTitle>
              {getPriorityBadge(dispute.priority)}
            </div>
            <CardDescription className="line-clamp-2">{dispute.description}</CardDescription>
          </div>
          {getStatusBadge(dispute.status)}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">IP Asset:</span>
              <span className="font-medium">{dispute.ipAsset}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Avatar className="h-4 w-4">
                <AvatarFallback className="text-xs">{otherParty?.slice(2, 4).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">{type === "filed" ? "Defendant:" : "Plaintiff:"}</span>
              <span>{formatAddress(otherParty)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Filed:</span>
              <span>{dispute.filedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Last Update:</span>
              <span>{dispute.lastUpdate}</span>
            </div>
          </div>
        </div>

        {dispute.dueDate && (
          <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Response due by {dispute.dueDate}</span>
            </div>
          </div>
        )}

        {dispute.resolution && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">{dispute.resolution}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{dispute.evidence} evidence</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{dispute.responses} responses</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onView}>
              View Details
            </Button>
            {type === "received" && dispute.status === "response-required" && <Button size="sm">Respond</Button>}
            {type === "filed" && dispute.status === "under-review" && (
              <Button variant="outline" size="sm">
                Add Evidence
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
