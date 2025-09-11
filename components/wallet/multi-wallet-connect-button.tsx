"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Download, CheckCircle, AlertCircle, Mail, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHederaWallet } from "@/components/wallet/hedera-wallet-provider";

const wallets = [
  {
    id: "hashpack",
    name: "HashPack",
    chain: "hedera",
    icon: "🔷",
    description: "Official Hedera wallet",
    downloadUrl: "https://www.hashpack.app/download",
    installed: typeof window !== "undefined" && typeof (window as any).hashconnect !== "undefined",
  },
  {
    id: "metamask",
    name: "MetaMask",
    chain: "ethereum",
    icon: "🦊",
    description: "Most popular Ethereum wallet",
    downloadUrl: "https://metamask.io/download/",
    installed: typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined",
  },
  {
    id: "phantom",
    name: "Phantom",
    chain: "solana",
    icon: "👻",
    description: "Leading Solana wallet",
    downloadUrl: "https://phantom.app/download",
    installed: typeof window !== "undefined" && typeof (window as any).solana !== "undefined",
  },
  {
    id: "dummy",
    name: "Email Login",
    chain: "dummy",
    icon: "📧",
    description: "Test login with email verification",
    downloadUrl: null,
    installed: true,
  },
];

export function MultiWalletConnectButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [dummyEmail, setDummyEmail] = useState("");
  const [showForm, setShowForm] = useState<"dummy" | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { connect: connectHedera, isInitialized, error: hederaError } = useHederaWallet();

  const handleConnect = async (wallet: typeof wallets[number]) => {
    setConnectingWallet(wallet.id);

    try {
      if (wallet.id === "dummy") {
        setShowForm("dummy");
        setConnectingWallet(null);
        return;
      }

      if (wallet.id === "hashpack") {
        if (!isInitialized) {
          throw new Error("Hedera wallet is still initializing. Please try again in a moment.");
        }

        if (hederaError) {
          throw new Error(hederaError);
        }

        // For demo purposes, simulate HashPack connection
        // In a real app, this would trigger the HashPack browser extension
        const mockAccountId = "0.0.123456";
        
        // Simulate the HashPack connection flow
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        connectHedera(mockAccountId);
        
        const address = mockAccountId;
        const chain = wallet.chain;

        localStorage.setItem("authToken", JSON.stringify({ address, chain }));
        document.cookie = `auth-token=${JSON.stringify({ address, chain })}; path=/; max-age=86400`;
        localStorage.setItem("walletAddress", address);

        toast({
          title: "Hedera Wallet Connected",
          description: `Successfully connected to ${wallet.name} with account ${mockAccountId}`,
        });

        setIsOpen(false);
        setConnectingWallet(null);
        router.push("/dashboard");
        return;
      }

      if (wallet.id === "metamask") {
        if (typeof (window as any).ethereum === "undefined") {
          throw new Error("MetaMask not installed");
        }

        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts found");
        }
        const address = accounts[0];
        const chain = wallet.chain;

        localStorage.setItem("authToken", JSON.stringify({ address, chain }));
        document.cookie = `auth-token=${JSON.stringify({ address, chain })}; path=/; max-age=86400`;
        localStorage.setItem("walletAddress", address);

        toast({
          title: "Wallet Connected",
          description: `Successfully connected to ${wallet.name}`,
        });

        setIsOpen(false);
        setConnectingWallet(null);
        router.push("/dashboard");
      } else if (wallet.id === "phantom") {
        if (typeof (window as any).solana === "undefined") {
          throw new Error("Phantom not installed");
        }

        const response = await (window as any).solana.connect();
        if (!response || !response.publicKey) {
          throw new Error("Failed to get Solana public key");
        }
        const address = response.publicKey.toString();
        const chain = wallet.chain;

        localStorage.setItem("authToken", JSON.stringify({ address, chain }));
        document.cookie = `auth-token=${JSON.stringify({ address, chain })}; path=/; max-age=86400`;
        localStorage.setItem("walletAddress", address);

        toast({
          title: "Wallet Connected",
          description: `Successfully connected to ${wallet.name}`,
        });

        setIsOpen(false);
        setConnectingWallet(null);
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error(`Connection failed for ${wallet.id}:`, error);
      
      let errorMessage = error.message || "Connection failed";
      
      if (error.code === 4001) {
        errorMessage = "User rejected the connection request";
      }

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setConnectingWallet(null);
    }
  };

  const handleDummyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnectingWallet("dummy");

    try {
      if (!dummyEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dummyEmail)) {
        throw new Error("Please enter a valid email address");
      }

      // Simulate email verification process
      await new Promise(resolve => setTimeout(resolve, 1500));

      const chain = "email";
      const address = dummyEmail;

      localStorage.setItem("authToken", JSON.stringify({ address, chain }));
      document.cookie = `auth-token=${JSON.stringify({ address, chain })}; path=/; max-age=86400`;
      localStorage.setItem("walletAddress", address);

      toast({
        title: "Email Verification Sent",
        description: `Verification email sent to ${address}. For demo purposes, you're now logged in.`,
      });

      setIsOpen(false);
      setShowForm(null);
      setDummyEmail("");
      setConnectingWallet(null);
      router.push("/dashboard");
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: `Failed to login: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setConnectingWallet(null);
    }
  };

  const getChainColor = (chain: string) => {
    switch (chain) {
      case "ethereum":
        return "bg-blue-500";
      case "hedera":
        return "bg-purple-500";
      case "solana":
        return "bg-green-500";
      case "dummy":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setShowForm(null);
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full">
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading">Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet or use email for testing. Hedera HashPack provides the most secure blockchain experience.
          </DialogDescription>
        </DialogHeader>

        {showForm === "dummy" ? (
          <form onSubmit={handleDummyLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dummy-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dummy-email"
                  type="email"
                  placeholder="Enter your email for verification"
                  value={dummyEmail}
                  onChange={(e) => setDummyEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                A verification email will be sent to confirm your identity
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={connectingWallet === "dummy"}>
              {connectingWallet === "dummy" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending Verification...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Verification Email
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setShowForm(null)}
            >
              Back to Wallet Selection
            </Button>
          </form>
        ) : (
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {wallets.map((wallet) => (
              <Card
                key={wallet.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{wallet.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{wallet.name}</h3>
                          <div
                            className={`w-2 h-2 rounded-full ${getChainColor(wallet.chain)}`}
                          />
                          <Badge variant="outline" className="text-xs">
                            {wallet.chain}
                          </Badge>
                          {wallet.id === "hashpack" && (
                            <Badge className="bg-purple-500 text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{wallet.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {wallet.installed ? (
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
                            <a
                              href={wallet.downloadUrl ?? "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
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
            <strong>Security Notice:</strong> Only connect wallets from official
            sources. Modred will never ask for your private keys or seed phrases.
            {!isInitialized && (
              <span className="block mt-1 text-yellow-600">
                Hedera wallet is initializing...
              </span>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}