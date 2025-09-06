"use client";

import { AuthGuard } from "@/components/wallet/auth-guard";
import { LicensingMarketplace } from "@/components/licensing/licensing-marketplace";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LicensingPage() {
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
                  <Scale className="h-3 w-3 mr-1" />
                  IP Licensing Marketplace
                </Badge>
                <h1 className="font-heading font-bold text-3xl md:text-4xl mb-2">License Intellectual Property</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover and license IP assets with smart contracts and automated royalty distribution
                </p>
              </div>
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        <LicensingMarketplace />
      </div>
    </AuthGuard>
  );
}