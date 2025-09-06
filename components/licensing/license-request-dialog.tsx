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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Scale, FileText, Loader2 } from "lucide-react"

const licenseRequestSchema = z.object({
  licenseType: z.enum(["exclusive", "non-exclusive", "limited"]),
  duration: z.string().min(1, "Duration is required"),
  territory: z.string().min(1, "Territory is required"),
  purpose: z.string().min(10, "Purpose must be at least 10 characters"),
  budget: z.string().min(1, "Budget is required"),
  startDate: z.string().min(1, "Start date is required"),
  additionalTerms: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
})

type LicenseRequestData = z.infer<typeof licenseRequestSchema>

interface LicenseRequestDialogProps {
  asset: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LicenseRequestDialog({ asset, open, onOpenChange }: LicenseRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<LicenseRequestData>({
    resolver: zodResolver(licenseRequestSchema),
    defaultValues: {
      licenseType: undefined,
      duration: "",
      territory: "",
      purpose: "",
      budget: "",
      startDate: "",
      additionalTerms: "",
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

  const onSubmit = async (data: LicenseRequestData) => {
    setIsSubmitting(true)
    try {
      // Simulate license request submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "License Request Submitted!",
        description: "Your license request has been sent to the IP owner for review.",
      })

      reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "There was an error submitting your license request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!asset) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">Request License</DialogTitle>
          <DialogDescription>
            Submit a license request for "{asset.title}" by {asset.owner}
          </DialogDescription>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Asset Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Asset Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">{asset.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">{asset.description}</p>
                </div>

                <div className="flex gap-2">
                  <Badge variant="secondary">{asset.type}</Badge>
                  <Badge variant="outline">{asset.category}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price:</span>
                    <span className="font-medium">{asset.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Royalty Rate:</span>
                    <span className="font-medium">{asset.royaltyRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Licenses Issued:</span>
                    <span className="font-medium">{asset.licensesIssued}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    License requests are reviewed within 48 hours. You'll be notified of the decision via email.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* License Request Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    License Terms
                  </CardTitle>
                  <CardDescription>Specify the terms and conditions for your license request</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="licenseType">License Type *</Label>
                      <Select onValueChange={(value) => setValue("licenseType", value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select license type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exclusive">Exclusive License</SelectItem>
                          <SelectItem value="non-exclusive">Non-Exclusive License</SelectItem>
                          <SelectItem value="limited">Limited License</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.licenseType && <p className="text-sm text-destructive">{errors.licenseType.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration *</Label>
                      <Select onValueChange={(value) => setValue("duration", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-year">1 Year</SelectItem>
                          <SelectItem value="2-years">2 Years</SelectItem>
                          <SelectItem value="5-years">5 Years</SelectItem>
                          <SelectItem value="perpetual">Perpetual</SelectItem>
                          <SelectItem value="custom">Custom Duration</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="territory">Territory *</Label>
                      <Select onValueChange={(value) => setValue("territory", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select territory" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="worldwide">Worldwide</SelectItem>
                          <SelectItem value="north-america">North America</SelectItem>
                          <SelectItem value="europe">Europe</SelectItem>
                          <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                          <SelectItem value="specific-country">Specific Country</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.territory && <p className="text-sm text-destructive">{errors.territory.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input type="date" {...register("startDate")} />
                      {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Intended Use *</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Describe how you plan to use this IP..."
                      rows={3}
                      {...register("purpose")}
                    />
                    {errors.purpose && <p className="text-sm text-destructive">{errors.purpose.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range *</Label>
                    <Select onValueChange={(value) => setValue("budget", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-1-eth">Under 1 ETH</SelectItem>
                        <SelectItem value="1-5-eth">1-5 ETH</SelectItem>
                        <SelectItem value="5-10-eth">5-10 ETH</SelectItem>
                        <SelectItem value="10-plus-eth">10+ ETH</SelectItem>
                        <SelectItem value="negotiable">Negotiable</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.budget && <p className="text-sm text-destructive">{errors.budget.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalTerms">Additional Terms (Optional)</Label>
                    <Textarea
                      id="additionalTerms"
                      placeholder="Any additional terms or special requirements..."
                      rows={2}
                      {...register("additionalTerms")}
                    />
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
                        I agree to the licensing terms and conditions *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        By submitting this request, you agree to the platform's licensing terms and the IP owner's
                        conditions.
                      </p>
                    </div>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-destructive mt-2">{errors.agreeToTerms.message}</p>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
