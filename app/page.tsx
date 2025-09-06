import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, FileText, Scale, DollarSign, Users, Lock } from "lucide-react"
import Link from "next/link"
import { WalletStatus } from "@/components/wallet/wallet-status"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-heading font-bold text-xl text-foreground">Modred</span>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </div>

            {/* Right side: Wallet + Toggle + Dashboard */}
            <div className="flex items-center space-x-4">
              <ThemeToggle /> {}
              <WalletStatus />
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            Blockchain-Powered IP Protection
          </Badge>

          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-balance mb-6">
            Secure Your <span className="text-primary">Intellectual Property</span> on the Blockchain
          </h1>

          <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto mb-8">
            Modred combines blockchain technology with legal enforcement to provide comprehensive IP protection.
            Register, license, and protect your creative works with immutable on-chain records.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register-ip">Register Your IP</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Complete IP Management Solution</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              From registration to enforcement, Modred provides all the tools you need to protect your intellectual
              property.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">IP Registration</CardTitle>
                <CardDescription>
                  Register your intellectual property on-chain with immutable proof of ownership and creation
                  timestamps.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <Scale className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">Smart Licensing</CardTitle>
                <CardDescription>
                  Create and manage licenses with automated enforcement through smart contracts and PIL terms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">Dispute Resolution</CardTitle>
                <CardDescription>
                  Handle IP disputes through our hybrid on-chain and off-chain resolution system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">Royalty Management</CardTitle>
                <CardDescription>
                  Automated royalty distribution and revenue sharing through smart contract mechanisms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">Legal Integration</CardTitle>
                <CardDescription>
                  Bridge blockchain records with traditional legal systems for comprehensive protection.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <Lock className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">Secure Wallet</CardTitle>
                <CardDescription>
                  Connect your wallet securely to manage IP assets, licenses, and transactions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">How Modred Works</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Simple steps to secure and manage your intellectual property on the blockchain.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="font-heading font-bold text-2xl text-primary">1</span>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-4">Connect & Register</h3>
              <p className="text-muted-foreground">
                Connect your wallet and register your intellectual property with immutable blockchain records.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="font-heading font-bold text-2xl text-primary">2</span>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-4">License & Monetize</h3>
              <p className="text-muted-foreground">
                Create smart contracts for licensing your IP with automated royalty distribution.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="font-heading font-bold text-2xl text-primary">3</span>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-4">Protect & Enforce</h3>
              <p className="text-muted-foreground">
                Monitor usage and enforce your rights through our hybrid blockchain-legal system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">Ready to Protect Your IP?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators and businesses securing their intellectual property with Modred.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register-ip">Start Registration</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-heading font-bold text-lg">Modred</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Blockchain-powered intellectual property protection and management platform.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/register-ip" className="hover:text-foreground transition-colors">
                    Register IP
                  </Link>
                </li>
                <li>
                  <Link href="/licensing" className="hover:text-foreground transition-colors">
                    Licensing
                  </Link>
                </li>
                <li>
                  <Link href="/disputes" className="hover:text-foreground transition-colors">
                    Disputes
                  </Link>
                </li>
                <li>
                  <Link href="/royalties" className="hover:text-foreground transition-colors">
                    Royalties
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-foreground transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/legal" className="hover:text-foreground transition-colors">
                    Legal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Modred. All rights reserved. Built on blockchain technology.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
