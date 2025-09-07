"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MultiWalletConnectButton } from "@/components/wallet/multi-wallet-connect-button"
import { EnhancedWalletStatus } from "@/components/wallet/enhanced-wallet-status"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  Shield, 
  FileText, 
  List, 
  ShoppingCart, 
  Scale, 
  Wallet, 
  Home,
  Menu,
  Settings,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Register IP", href: "/dashboard/ip-registration", icon: FileText },
  { name: "My IP Assets", href: "/dashboard/ip-listing", icon: List },
  { name: "Marketplace", href: "/dashboard/ip-selling", icon: ShoppingCart },
  { name: "Compliance", href: "/dashboard/ip-regulation", icon: Scale },
  { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-heading font-bold text-xl text-foreground">Modred</span>
            </Link>
            <Badge variant="outline" className="hidden sm:inline-flex">
              Dashboard
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2",
                      isActive && "bg-primary/10 text-primary"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <EnhancedWalletStatus />
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-6">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="font-heading font-bold text-lg">Modred</span>
                  </div>

                  <div className="flex-1 space-y-2">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                      return (
                        <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start gap-3",
                              isActive && "bg-primary/10 text-primary"
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                          </Button>
                        </Link>
                      )
                    })}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}