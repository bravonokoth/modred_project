"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

// Mock data for recent registrations
const recentRegistrations = [
  {
    id: "1",
    title: "Mobile App Design System",
    type: "Design",
    status: "completed",
    date: "2024-01-15",
    tokenId: "NFT-001",
  },
  {
    id: "2", 
    title: "AI Algorithm Patent",
    type: "Patent",
    status: "pending",
    date: "2024-01-12",
    tokenId: null,
  },
  {
    id: "3",
    title: "Brand Logo Collection", 
    type: "Trademark",
    status: "completed",
    date: "2024-01-10",
    tokenId: "NFT-002",
  },
]

export function IPRegistrationList() {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Recent Registrations</CardTitle>
        <CardDescription>Your latest IP registration activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentRegistrations.map((registration) => (
            <div
              key={registration.id}
              className="flex items-center justify-between p-3 border border-border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(registration.status)}
                <div>
                  <p className="font-medium text-sm">{registration.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {registration.type} • {registration.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(registration.status)}
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>

        {recentRegistrations.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-lg mb-2">No Registrations Yet</h3>
            <p className="text-muted-foreground">
              Your registered IP assets will appear here once you complete the registration process.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}