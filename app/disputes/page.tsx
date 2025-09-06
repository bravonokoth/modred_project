import { AuthGuard } from "@/components/wallet/auth-guard"
import { DisputeManagement } from "@/components/disputes/dispute-management"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"

export default function DisputesPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                <Shield className="h-3 w-3 mr-1" />
                Dispute Resolution System
              </Badge>
              <h1 className="font-heading font-bold text-3xl md:text-4xl mb-2">IP Dispute Resolution</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Resolve intellectual property disputes through our hybrid blockchain and legal enforcement system
              </p>
            </div>
          </div>
        </div>

        <DisputeManagement />
      </div>
    </AuthGuard>
  )
}
