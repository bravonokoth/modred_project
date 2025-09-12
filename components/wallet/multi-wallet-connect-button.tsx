"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Wallet, Download, CheckCircle, AlertCircle, Mail, Loader2, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { createWallet, inAppWallet } from "thirdweb/wallets"
import { useConnect, useActiveAccount, useDisconnect, useActiveWallet } from "thirdweb/react"
import { preAuthenticate } from "thirdweb/wallets/in-app"
import { client } from "@/lib/thirdweb"
import { HederaService } from "@/lib/blockchain/hedera/hedera-service"

// Define wallet types with proper thirdweb IDs
interface WalletConfig {
  id: string
  name: string
  chain: string
  icon: string
  description: string
  downloadUrl: string | null
  thirdwebId: string | null
  installed: boolean
}

// Define wallets with Hedera first and proper detection
const wallets: WalletConfig[] = [
  {
    id: "hashpack",
    name: "HashPack",
    chain: "hedera",
    icon: "🔷",
    description: "Official Hedera wallet",
    downloadUrl: "https://www.hashpack.app/download",
    thirdwebId: null,
    installed:
      typeof window !== "undefined" &&
      (typeof (window as any).hashconnect !== "undefined" ||
        localStorage.getItem("hashconnect") !== null ||
        document.querySelector('meta[name="hashpack-installed"]') !== null),
  },
  {
    id: "metamask",
    name: "MetaMask",
    chain: "ethereum",
    icon: "🦊",
    description: "Most popular Ethereum wallet",
    downloadUrl: "https://metamask.io/download/",
    thirdwebId: "io.metamask",
    installed: typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined",
  },
  {
    id: "email",
    name: "Email Login",
    chain: "ethereum",
    icon: "📧",
    description: "Login with email verification",
    downloadUrl: null,
    thirdwebId: null,
    installed: true,
  },
  {
    id: "trustwallet",
    name: "Trust Wallet",
    chain: "ethereum",
    icon: "🔒",
    description: "Popular mobile wallet",
    downloadUrl: "https://trustwallet.com/download",
    thirdwebId: "com.trustwallet.app",
    installed: typeof window !== "undefined" && typeof (window as any).trustwallet !== "undefined",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    chain: "ethereum",
    icon: "🔗",
    description: "Connect via QR code",
    downloadUrl: null,
    thirdwebId: "walletConnect",
    installed: true,
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    chain: "ethereum",
    icon: "🔵",
    description: "Secure multi-chain wallet",
    downloadUrl: "https://www.coinbase.com/wallet",
    thirdwebId: "com.coinbase.wallet",
    installed: typeof window !== "undefined" && typeof (window as any).coinbaseWalletExtension !== "undefined",
  },
]

export function MultiWalletConnectButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [showForm, setShowForm] = useState<"email" | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [hederaService, setHederaService] = useState<HederaService | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // ThirdWeb v5 hooks
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const activeAccount = useActiveAccount()
  const activeWallet = useActiveWallet()

  // Check if any wallet is connected
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const authToken = localStorage.getItem("authToken")
    setIsConnected(!!(authToken || activeAccount))

    // Initialize Hedera service
    if (typeof window !== "undefined") {
      try {
        console.log(" Initializing Hedera service...")
        const service = new HederaService()
        setHederaService(service)
        console.log(" Hedera service initialized successfully")
      } catch (error) {
        console.error(" Failed to initialize Hedera service:", error)
        toast({
          title: "Hedera Service Error",
          description: "Failed to initialize Hedera service. Please check your environment configuration.",
          variant: "destructive",
        })
      }
    }
  }, [activeAccount, toast])

  const handleConnect = async (wallet: WalletConfig) => {
    setConnectingWallet(wallet.id)
    console.log(" Attempting to connect wallet:", wallet.name)

    try {
      if (wallet.id === "email") {
        setShowForm("email")
        setConnectingWallet(null)
        return
      }

      if (wallet.id === "hashpack") {
        if (!hederaService) {
          throw new Error("Hedera service not initialized. Please check your environment configuration.")
        }

        try {
          console.log(" Attempting to connect to HashPack...")

          toast({
            title: "Connecting to HashPack",
            description: "Please check your browser for the HashPack popup and approve the connection.",
          })

          const accountId = await hederaService.connect()

          if (!accountId) {
            throw new Error("Failed to get account ID from HashPack")
          }

          console.log("HashPack connected successfully:", accountId)

          const authToken = JSON.stringify({ address: accountId, chain: "hedera" })
          localStorage.setItem("authToken", authToken)
          document.cookie = `auth-token=${authToken}; path=/; max-age=86400`
          localStorage.setItem("walletAddress", accountId)

          toast({
            title: "HashPack Connected Successfully!",
            description: `Connected with account ${accountId}. Redirecting to dashboard...`,
          })

          setIsConnected(true)
          setIsOpen(false)
          setShowForm(null)

          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
          return
        } catch (hederaError) {
          console.error("HashPack connection error:", hederaError)

          const errorMessage = (hederaError as Error).message
          if (errorMessage.includes("not detected")) {
            toast({
              title: "HashPack Not Found",
              description: "Please install the HashPack browser extension and refresh the page.",
              variant: "destructive",
            })
          } else if (errorMessage.includes("timeout")) {
            toast({
              title: "Connection Timeout",
              description: "Please ensure HashPack is unlocked and try again.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "HashPack Connection Failed",
              description: errorMessage,
              variant: "destructive",
            })
          }
          throw hederaError
        }
      }

      // Handle thirdweb wallets
      if (wallet.thirdwebId) {
        try {
          console.log("[v0] Creating thirdweb wallet:", wallet.thirdwebId)
          const walletInstance = createWallet(wallet.thirdwebId as any)

          const connectedWallet = await connect(async () => {
            await walletInstance.connect({ client })
            return walletInstance
          })

          if (!connectedWallet) {
            throw new Error(`Failed to connect to ${wallet.name}`)
          }

          // Get the account from the connected wallet
          const account = connectedWallet.getAccount()
          if (!account) {
            throw new Error(`Failed to get account from ${wallet.name}`)
          }

          const address = account.address
          const chain = wallet.chain

          console.log("Thirdweb wallet connected:", { address, chain })

          const authToken = JSON.stringify({ address, chain })
          localStorage.setItem("authToken", authToken)
          document.cookie = `auth-token=${authToken}; path=/; max-age=86400`
          localStorage.setItem("walletAddress", address)

          toast({
            title: "Wallet Connected",
            description: `Successfully connected to ${wallet.name}`,
          })

          setIsConnected(true)
          setIsOpen(false)
          router.push("/dashboard")
        } catch (thirdwebError) {
          console.error("Thirdweb wallet connection error:", thirdwebError)
          throw new Error(`${wallet.name} connection failed: ${(thirdwebError as Error).message}`)
        }
      }
    } catch (err: any) {
      console.error(" Connection error for", wallet.name, ":", err)
      toast({
        title: `${wallet.name} Connection Failed`,
        description: `Failed to connect: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setConnectingWallet(null)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setConnectingWallet("email")

    try {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address")
      }

      if (!emailSent) {
        // Send verification code using preAuthenticate
        await preAuthenticate({
          client,
          strategy: "email",
          email,
        })

        setEmailSent(true)
        toast({
          title: "Verification Code Sent",
          description: `Please check your email (${email}) for the verification code.`,
        })
        setConnectingWallet(null)
        return
      }

      if (!verificationCode) {
        throw new Error("Please enter the verification code")
      }

      // Connect with verification code
      const wallet = inAppWallet()
      const connectedWallet = await connect(async () => {
        await wallet.connect({
          client,
          strategy: "email",
          email,
          verificationCode,
        })
        return wallet
      })

      if (!connectedWallet) {
        throw new Error("Failed to connect with email")
      }

      // Get the account from the connected wallet
      const account = connectedWallet.getAccount()
      if (!account) {
        throw new Error("Failed to get account from email wallet")
      }

      const address = account.address
      const chain = "ethereum"

      const authToken = JSON.stringify({ address, chain })
      localStorage.setItem("authToken", authToken)
      document.cookie = `auth-token=${authToken}; path=/; max-age=86400`
      localStorage.setItem("walletAddress", address)

      toast({
        title: "Email Login Successful",
        description: `Successfully logged in with ${email}`,
      })

      setIsConnected(true)
      setIsOpen(false)
      setShowForm(null)
      setEmail("")
      setVerificationCode("")
      setEmailSent(false)
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Email login error:", err)
      toast({
        title: "Email Login Failed",
        description: `Failed to login: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setConnectingWallet(null)
    }
  }

  const handleSignOut = async () => {
    try {
      // Disconnect thirdweb wallets
      if (activeWallet) {
        await disconnect(activeWallet)
      }

      // Disconnect Hedera if connected
      if (hederaService) {
        try {
          // Call disconnect if it exists, otherwise just clear local data
          if (typeof hederaService.disconnect === "function") {
            await hederaService.disconnect()
          }
        } catch (error) {
          console.warn("Hedera disconnect warning:", error)
        }
      }

      // Clear all stored data
      localStorage.removeItem("authToken")
      localStorage.removeItem("walletAddress")
      localStorage.removeItem("hedera_wallet_account")
      localStorage.removeItem("hedera_wallet_connected")
      localStorage.removeItem("hedera_account_id")
      localStorage.removeItem("hedera_topic")
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

      setIsConnected(false)

      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      })

      router.push("/")
    } catch (err: any) {
      console.error("Sign out error:", err)
      toast({
        title: "Sign Out Failed",
        description: `Failed to sign out: ${err.message}`,
        variant: "destructive",
      })
    }
  }

  const getChainColor = (chain: string) => {
    switch (chain) {
      case "ethereum":
        return "bg-blue-500"
      case "hedera":
        return "bg-purple-500"
      case "solana":
        return "bg-green-500"
      case "polygon":
        return "bg-violet-500"
      case "base":
        return "bg-blue-600"
      default:
        return "bg-gray-500"
    }
  }

  const resetForms = () => {
    setShowForm(null)
    setEmail("")
    setVerificationCode("")
    setEmailSent(false)
    setConnectingWallet(null)
  }

  return (
    <div>
      {isConnected ? (
        <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      ) : (
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) resetForms()
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">Connect Your Wallet</DialogTitle>
              <DialogDescription>
                Choose from supported wallets or use email for secure authentication.
              </DialogDescription>
            </DialogHeader>

            {showForm === "email" ? (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={emailSent}
                    />
                  </div>
                </div>

                {emailSent && (
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Verification Code</Label>
                    <Input
                      id="verification-code"
                      placeholder="Enter 6-digit code from email"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Check your email for the verification code. It may take a few minutes to arrive.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={resetForms}
                    disabled={connectingWallet === "email"}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={
                      connectingWallet === "email" || (!emailSent && !email) || (emailSent && !verificationCode)
                    }
                  >
                    {connectingWallet === "email" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {emailSent ? "Verifying..." : "Sending..."}
                      </>
                    ) : emailSent ? (
                      "Verify & Connect"
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {wallets.map((wallet) => (
                  <Card key={wallet.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{wallet.icon}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{wallet.name}</h3>
                              <div className={`w-2 h-2 rounded-full ${getChainColor(wallet.chain)}`} />
                              <Badge variant="outline" className="text-xs">
                                {wallet.chain}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{wallet.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {wallet.installed || wallet.id === "email" ? (
                            <Button
                              onClick={() => handleConnect(wallet)}
                              disabled={connectingWallet === wallet.id}
                              size="sm"
                            >
                              {connectingWallet === wallet.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Connect
                                </>
                              )}
                            </Button>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                              <Button variant="outline" size="sm" asChild>
                                <a href={wallet.downloadUrl ?? "#"} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4 mr-1" />
                                  Install
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Security Notice:</strong> Only connect wallets from official sources. Modred will never ask for
                your private keys or seed phrases.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
