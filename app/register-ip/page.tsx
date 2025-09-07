import { AuthGuard } from "@/components/wallet/auth-guard"
import { IPRegistrationForm } from "@/app/(dashboard)/ip-registration/components/IPRegistrationForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { FileText, Shield, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegisterIPPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/dashboard")
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <Badge variant="secondary" className="mb-4">
                  Blockchain IP Registration
                </Badge>
                <h1 className="font-heading font-bold text-3xl md:text-4xl mb-2">Register Your Intellectual Property</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Secure your creative works with immutable blockchain records and legal protection
                </p>
              </div>
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Registration Form */}
            <div className="lg:col-span-2">
              <IPRegistrationForm />
            </div>

            {/* Benefits Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Registration Benefits</CardTitle>
                  <CardDescription>What you get with blockchain IP registration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Immutable Proof</p>
                      <p className="text-xs text-muted-foreground">Permanent blockchain record of ownership</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Timestamp Protection</p>
                      <p className="text-xs text-muted-foreground">Exact creation date verification</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Legal Integration</p>
                      <p className="text-xs text-muted-foreground">Bridge to traditional legal systems</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Global Recognition</p>
                      <p className="text-xs text-muted-foreground">Worldwide blockchain verification</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Registration Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">1</span>
                    </div>
                    <p className="text-sm">Fill registration details</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">2</span>
                    </div>
                    <p className="text-sm">Upload IP assets</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">3</span>
                    </div>
                    <p className="text-sm">Review and confirm</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">4</span>
                    </div>
                    <p className="text-sm">Blockchain registration</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
