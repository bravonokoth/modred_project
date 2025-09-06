import type React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { MultiWalletGuard } from "@/components/wallet/multi-wallet-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MultiWalletGuard>
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </MultiWalletGuard>
  )
}