"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileUpload } from "@/components/ip/file-upload"
import { useToast } from "@/hooks/use-toast"
import { FileText, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"

const ipRegistrationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["patent", "trademark", "copyright", "design", "trade-secret"]),
  category: z.string().min(1, "Please select a category"),
  tags: z.string().optional(),
  files: z.array(z.any()).min(1, "At least one file is required"),
  agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
  publicListing: z.boolean().default(false),
})

type IPRegistrationData = z.infer<typeof ipRegistrationSchema>

const steps = [
  { id: 1, name: "Basic Information", description: "IP details and metadata" },
  { id: 2, name: "File Upload", description: "Upload your IP assets" },
  { id: 3, name: "Review & Submit", description: "Review and register on blockchain" },
]

export function IPRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const { toast } = useToast()

  const form = useForm<IPRegistrationData>({
    resolver: zodResolver(ipRegistrationSchema),
    defaultValues: {
      title: "",
      description: "",
      type: undefined,
      category: "",
      tags: "",
      files: [],
      agreeToTerms: false,
      publicListing: false,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = form

  const watchedData = watch()
  const progress = (currentStep / steps.length) * 100

  const nextStep = async () => {
    let fieldsToValidate: (keyof IPRegistrationData)[] = []

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["title", "description", "type", "category"]
        break
      case 2:
        fieldsToValidate = ["files"]
        setValue("files", uploadedFiles)
        break
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: IPRegistrationData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/ip/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "IP Registration Successful!",
          description: "Your intellectual property has been registered on the blockchain.",
        })
        window.location.href = "/dashboard"
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error registering your IP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">IP Title *</Label>
              <Input id="title" placeholder="Enter a descriptive title for your IP" {...register("title")} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of your intellectual property"
                rows={4}
                {...register("description")}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">IP Type *</Label>
                <Select onValueChange={(value) => setValue("type", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select IP type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patent">Patent</SelectItem>
                    <SelectItem value="trademark">Trademark</SelectItem>
                    <SelectItem value="copyright">Copyright</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="trade-secret">Trade Secret</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="literature">Literature</SelectItem>
                    <SelectItem value="invention">Invention</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas (e.g., mobile, app, design)"
                {...register("tags")}
              />
              <p className="text-xs text-muted-foreground">Tags help categorize and search your IP</p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-lg mb-2">Upload IP Assets</h3>
              <p className="text-muted-foreground mb-4">
                Upload files that represent or document your intellectual property
              </p>
            </div>

            <FileUpload
              files={uploadedFiles}
              onFilesChange={setUploadedFiles}
              maxFiles={10}
              maxSize={50 * 1024 * 1024}
            />

            {errors.files && <p className="text-sm text-destructive">{errors.files.message}</p>}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-lg mb-2">Review Your Registration</h3>
              <p className="text-muted-foreground mb-4">
                Please review all information before submitting to the blockchain
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">{watchedData.title || "Untitled IP"}</CardTitle>
                <CardDescription>{watchedData.description || "No description provided"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">IP Type</p>
                    <Badge variant="secondary">
                      {watchedData.type ? watchedData.type.charAt(0).toUpperCase() + watchedData.type.slice(1) : "Not specified"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Category</p>
                    <Badge variant="outline">
                      {watchedData.category ? watchedData.category.charAt(0).toUpperCase() + watchedData.category.slice(1) : "Not specified"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={watchedData.agreeToTerms}
                      onCheckedChange={(checked) => setValue("agreeToTerms", checked as boolean)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="agreeToTerms" className="text-sm font-medium">
                        I agree to the Terms of Service and Privacy Policy *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        By registering, you confirm ownership and agree to our terms
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="publicListing"
                      checked={watchedData.publicListing}
                      onCheckedChange={(checked) => setValue("publicListing", checked as boolean)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="publicListing" className="text-sm font-medium">
                        Make this IP available for public licensing
                      </Label>
                      <p className="text-xs text-muted-foreground">Others can discover and request licenses for your IP</p>
                    </div>
                  </div>

                  {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-heading">
              Step {currentStep}: {steps[currentStep - 1].name}
            </CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </div>
          <Badge variant="outline">
            {currentStep} of {steps.length}
          </Badge>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1 || isSubmitting}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button type="button" onClick={nextStep} disabled={isSubmitting}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Register IP
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}