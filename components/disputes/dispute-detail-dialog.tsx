"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { FileText, MessageSquare, Clock, AlertTriangle, CheckCircle, Shield, Upload, Send, Scale } from "lucide-react"

interface DisputeDetailDialogProps {
  dispute: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock timeline data
const mockTimeline = [
  {
    id: "1",
    type: "filed",
    title: "Dispute Filed",
    description: "Initial dispute filed with evidence",
    date: "2024-01-20",
    time: "10:30 AM",
    user: "You",
  },
  {
    id: "2",
    type: "notification",
    title: "Defendant Notified",
    description: "Notification sent to defendant with 7-day response period",
    date: "2024-01-20",
    time: "10:35 AM",
    user: "System",
  },
  {
    id: "3",
    type: "response",
    title: "Response Received",
    description: "Defendant submitted their response with counter-evidence",
    date: "2024-01-22",
    time: "2:15 PM",
    user: "0x8765...4321",
  },
  {
    id: "4",
    type: "review",
    title: "Under Review",
    description: "Case assigned to dispute resolution team for review",
    date: "2024-01-22",
    time: "3:00 PM",
    user: "System",
  },
]

export function DisputeDetailDialog({ dispute, open, onOpenChange }: DisputeDetailDialogProps) {
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  if (!dispute) return null

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "under-review":
      case "awaiting-response":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "response-required":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "resolved-settlement":
      case "resolved-dismissed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "escalated":
        return <Shield className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "filed":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "notification":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "response":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "review":
        return <Scale className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const handleSubmitResponse = async () => {
    if (!response.trim()) return

    setIsSubmitting(true)
    try {
      // Simulate response submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Response Submitted",
        description: "Your response has been added to the dispute record.",
      })

      setResponse("")
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getStatusIcon(dispute.status)}
            <div>
              <DialogTitle className="font-heading text-xl">{dispute.title}</DialogTitle>
              <DialogDescription>
                Dispute ID: {dispute.id} • Filed on {dispute.filedDate}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="responses">Responses</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Dispute Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{dispute.description}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Category</h4>
                        <Badge variant="secondary">
                          {dispute.category.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Priority</h4>
                        <Badge variant={dispute.priority === "critical" ? "destructive" : "outline"}>
                          {dispute.priority.charAt(0).toUpperCase() + dispute.priority.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Affected IP Asset</h4>
                      <p className="text-sm">{dispute.ipAsset}</p>
                    </div>

                    {dispute.resolution && (
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h4 className="font-medium mb-2 text-green-700 dark:text-green-300">Resolution</h4>
                        <p className="text-sm text-green-600 dark:text-green-400">{dispute.resolution}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Dispute Timeline</CardTitle>
                    <CardDescription>Chronological history of dispute events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockTimeline.map((event, index) => (
                        <div key={event.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            {getTimelineIcon(event.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{event.title}</h4>
                              <span className="text-xs text-muted-foreground">
                                {event.date} {event.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">by {event.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="evidence" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Evidence</CardTitle>
                    <CardDescription>Documents and files submitted as evidence</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "Screenshot_infringement.png", size: "2.3 MB", type: "Image", date: "2024-01-20" },
                        { name: "Original_design_files.zip", size: "15.7 MB", type: "Archive", date: "2024-01-20" },
                        { name: "Legal_notice.pdf", size: "1.1 MB", type: "Document", date: "2024-01-20" },
                      ].map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {file.type} • {file.size} • {file.date}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" className="w-full bg-transparent">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Additional Evidence
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="responses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Responses & Communications</CardTitle>
                    <CardDescription>Messages and responses from all parties</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">87</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">0x8765...4321</span>
                          </div>
                          <span className="text-xs text-muted-foreground">2024-01-22, 2:15 PM</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          We dispute this claim. Our design was created independently and we have documentation proving
                          our original work predates the plaintiff's registration. We will provide counter-evidence
                          shortly.
                        </p>
                      </div>

                      {dispute.status === "response-required" && (
                        <div className="space-y-3">
                          <Label htmlFor="response">Your Response</Label>
                          <Textarea
                            id="response"
                            placeholder="Enter your response to this dispute..."
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            rows={4}
                          />
                          <Button onClick={handleSubmitResponse} disabled={isSubmitting || !response.trim()}>
                            {isSubmitting ? (
                              <>
                                <Clock className="h-4 w-4 mr-2 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Submit Response
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Dispute Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Status:</span>
                  <Badge variant={dispute.status === "resolved-settlement" ? "default" : "secondary"}>
                    {dispute.status.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Priority:</span>
                  <Badge variant={dispute.priority === "critical" ? "destructive" : "outline"}>
                    {dispute.priority.charAt(0).toUpperCase() + dispute.priority.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Update:</span>
                  <span className="text-sm">{dispute.lastUpdate}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Parties Involved</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Plaintiff (You)</p>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">YU</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Your Address</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Defendant</p>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {(dispute.defendant || dispute.plaintiff)?.slice(2, 4).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{formatAddress(dispute.defendant || dispute.plaintiff)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Evidence
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                {dispute.status !== "resolved-settlement" && (
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                    <Scale className="h-4 w-4 mr-2" />
                    Request Mediation
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
