"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, FileText, Loader2, Upload } from "lucide-react"

const disputeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.enum([
    "copyright-infringement",
    "patent-infringement",
    "trademark-dispute",
    "trade-secret-theft",
    "licensing-violation",
  ]),
  defendant: z.string().min(1, "Defendant address is required"),
  ipAsset: z.string().min(1, "Please select an IP asset"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  evidence: z.string().optional(),
  requestedAction: z.string().min(10, "Please specify the requested action"),
  agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
})

type DisputeData = z.infer<typeof disputeSchema>

interface CreateDisputeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock user IP assets
const mockIPAssets = [
  { id: "1", title: "Mobile App Design System", type: "Design" },
  { id: "2", title: "AI Algorithm Patent", type: "Patent" },
  { id: "3", title: "Brand Logo Collection", type: "Trademark" },
  { id: "4", title: "Music Composition Library", type: "Copyright" },
]

export function CreateDisputeDialog({ open, onOpenChange }: CreateDisputeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<DisputeData>({
    resolver: zodResolver(disputeSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      defendant: "",
      ipAsset: "",
      priority: "medium",
      evidence: "",
      requestedAction: "",
      agreeToTerms: false,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = form

  const watchedData = watch()

  const onSubmit = async (data: DisputeData) => {
    setIsSubmitting(true)
    try {
      // Simulate dispute filing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Dispute Filed Successfully!",
        description: "Your dispute has been submitted and will be reviewed within 24 hours.",
      })

      reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Filing Failed",
        description: "There was an error filing your dispute. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            File IP Dispute
          </DialogTitle>
          <DialogDescription>
            File a dispute for intellectual property infringement or violation. Please provide detailed information and
            evidence.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Dispute Details</CardTitle>
                  <CardDescription>Provide basic information about the dispute</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Dispute Title *</Label>
                    <Input id="title" placeholder="Brief, descriptive title for the dispute" {...register("title")} />
                    {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of the infringement or violation..."
                      rows={4}
                      {...register("description")}
                    />
                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Dispute Category *</Label>
                      <Select onValueChange={(value) => setValue("category", value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="copyright-infringement">Copyright Infringement</SelectItem>
                          <SelectItem value="patent-infringement">Patent Infringement</SelectItem>
                          <SelectItem value="trademark-dispute">Trademark Dispute</SelectItem>
                          <SelectItem value="trade-secret-theft">Trade Secret Theft</SelectItem>
                          <SelectItem value="licensing-violation">Licensing Violation</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level *</Label>
                      <Select onValueChange={(value) => setValue("priority", value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="defendant">Defendant Address *</Label>
                      <Input id="defendant" placeholder="0x..." {...register("defendant")} />
                      {errors.defendant && <p className="text-sm text-destructive">{errors.defendant.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ipAsset">Affected IP Asset *</Label>
                      <Select onValueChange={(value) => setValue("ipAsset", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select IP asset" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockIPAssets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.title}>
                              {asset.title} ({asset.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.ipAsset && <p className="text-sm text-destructive">{errors.ipAsset.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Evidence & Action</CardTitle>
                  <CardDescription>Provide evidence and specify what action you're requesting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="evidence">Evidence Description</Label>
                    <Textarea
                      id="evidence"
                      placeholder="Describe the evidence you have (screenshots, documents, etc.)..."
                      rows={3}
                      {...register("evidence")}
                    />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Upload className="h-4 w-4" />
                      <span>Evidence files can be uploaded after dispute creation</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requestedAction">Requested Action *</Label>
                    <Textarea
                      id="requestedAction"
                      placeholder="What action do you want taken? (cease and desist, damages, licensing, etc.)"
                      rows={3}
                      {...register("requestedAction")}
                    />
                    {errors.requestedAction && (
                      <p className="text-sm text-destructive">{errors.requestedAction.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={watchedData.agreeToTerms}
                      onCheckedChange={(checked) => setValue("agreeToTerms", checked as boolean)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="agreeToTerms" className="text-sm font-medium">
                        I agree to the dispute resolution terms and conditions *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        By filing this dispute, you confirm that the information provided is accurate and you have good
                        faith belief in the claim.
                      </p>
                    </div>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-destructive mt-2">{errors.agreeToTerms.message}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Dispute Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">1</span>
                    </div>
                    <p className="text-sm">File dispute with evidence</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">2</span>
                    </div>
                    <p className="text-sm">Defendant receives notification</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">3</span>
                    </div>
                    <p className="text-sm">Response period (7 days)</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">4</span>
                    </div>
                    <p className="text-sm">Review and resolution</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Important Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <p className="text-xs text-muted-foreground">Filing false disputes may result in penalties</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                    <p className="text-xs text-muted-foreground">Strong evidence improves resolution chances</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <p className="text-xs text-muted-foreground">Critical disputes are reviewed within 24 hours</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Filing Dispute...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  File Dispute
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
