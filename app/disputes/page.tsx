"use client";

import { AuthGuard } from "@/components/wallet/auth-guard";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Dynamically import heavy component to improve loading
const DisputeManagement = dynamic(
  () => import("@/components/disputes/dispute-management").then(mod => ({ default: mod.DisputeManagement })),
  { 
    loading: () => (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
);
export default function DisputesPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/dashboard"); // Navigate to dashboard
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <Badge variant="secondary" className="mb-4">
                  <Shield className="h-3 w-3 mr-1" />
                  Dispute Resolution System
                </Badge>
                <h1 className="font-heading font-bold text-3xl md:text-4xl mb-2">IP Dispute Resolution</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Resolve intellectual property disputes through our hybrid blockchain and legal enforcement system
                </p>
              </div>
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        <DisputeManagement />
      </div>
    </AuthGuard>
  );
}