import { AuthGuard } from "@/components/wallet/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IPRegistrationForm } from "@/app/(dashboard)/ip-registration/components/IPRegistrationForm";
import { IPRegistrationList } from "@/app/(dashboard)/ip-registration/components/IPRegistrationList";
import { FileText, Shield, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function IPRegistrationPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <Badge variant="secondary" className="mb-4">
                  <FileText className="h-3 w-3 mr-1" />
                  IP Registration System
                </Badge>
                <h1 className="font-heading font-bold text-3xl md:text-4xl mb-2">
                  Register Your Intellectual Property
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Secure your creative works with immutable blockchain records and comprehensive legal protection
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
            <div className="lg:col-span-2">
              <IPRegistrationForm />
            </div>
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
              <IPRegistrationList />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}