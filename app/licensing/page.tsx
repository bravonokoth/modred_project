import { WalletGuard } from "@/components/wallet/wallet-guard"
import { LicensingMarketplace } from "@/components/licensing/licensing-marketplace"
import { Badge } from "@/components/ui/badge"
import { Scale } from "lucide-react"

export default function LicensingPage() {
  return (
    <WalletGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                <Scale className="h-3 w-3 mr-1" />
                IP Licensing Marketplace
              </Badge>
              <h1 className="font-heading font-bold text-3xl md:text-4xl mb-2">License Intellectual Property</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover and license IP assets with smart contracts and automated royalty distribution
              </p>
            </div>
          </div>
        </div>

        <LicensingMarketplace />
      </div>
    </WalletGuard>
  )
}
