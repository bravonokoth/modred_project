"use client"

import dynamic from "next/dynamic"
import { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"

// Dynamically import the HederaWalletProvider with no SSR
const DynamicHederaWalletProvider = dynamic(
  () => import("./wallet/hedera-wallet-provider").then(mod => ({ 
    default: mod.HederaWalletProvider 
  })),
  { 
    ssr: false,
    loading: () => <div>Loading wallet...</div>
  }
)

interface ClientWrapperProps {
  children: ReactNode
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <ThemeProvider defaultTheme="light">
      <DynamicHederaWalletProvider>
        <div className="theme-transition">
          {children}
        </div>
      </DynamicHederaWalletProvider>
    </ThemeProvider>
  )
}