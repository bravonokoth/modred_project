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
    id: "metamask",
    name: "MetaMask",
    chain: "ethereum",
    icon: "🦊",
    description: "Most popular Ethereum wallet",
    downloadUrl: "https://metamask.io/download/",
    installed: typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined",
  },
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
    name: "Dummy Login",
    chain: "dummy",
    icon: "🧪",
    description: "Test login with email",
    downloadUrl: null,
    installed: true,
  },
];

export function MultiWalletConnectButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [dummyEmail, setDummyEmail] = useState("");
  const [hederaAccountId, setHederaAccountId] = useState("");
  const [showForm, setShowForm] = useState<"dummy" | "hashpack" | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { accountId, isConnected, isInitialized, connect: connectHedera, error: hederaError } = useHederaWallet();

  const handleConnect = async (wallet: typeof wallets[number]) => {
    setConnectingWallet(wallet.id);

    if (wallet.id === "dummy") {
      setShowForm("dummy");
      setConnectingWallet(null);
      return;
    }

    if (wallet.id === "hashpack") {
      if (!isInitialized) {
        toast({
          title: "Wallet Not Ready",
          description: "Hedera wallet is still initializing. Please try again in a moment.",
          variant: "destructive",
        });
        setConnectingWallet(null);
        return;
      }

      if (hederaError) {
        throw new Error(hederaError);
      }

      if (!hederaAccountId) {
        setShowForm("hashpack");
        setConnectingWallet(null);
        return;
      }

      try {
        await connectHedera(hederaAccountId);
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!accountId) {
          throw new Error("Failed to get Hedera account ID");
        }
        const address = accountId;
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
        setHederaAccountId("");
        setShowForm(null);
        router.push("/dashboard");
      } catch (hederaErr: any) {
        throw new Error(`Hedera connection failed: ${hederaErr.message}`);
      }
    } else if (wallet.id === "metamask") {
      if (typeof (window as any).ethereum === "undefined") {
        throw new Error("MetaMask not installed");
      }

      try {
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
      } catch (ethErr: any) {
        if (ethErr.code === 4001) {
          throw new Error("User rejected the connection request");
        }
        throw new Error(`MetaMask connection failed: ${ethErr.message}`);
      }
    } else if (wallet.id === "phantom") {
      if (typeof (window as any).solana === "undefined") {
        throw new Error("Phantom not installed");
      }

      try {
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
      } catch (solErr: any) {
        if (solErr.code === 4001) {
          throw new Error("User rejected the connection request");
        }
        throw new Error(`Phantom connection failed: ${solErr.message}`);
      }
    }
  };

  const handleDummyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnectingWallet("dummy");

    try {
      if (!dummyEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dummyEmail)) {
        throw new Error("Please enter a valid email address");
      }

      const chain = "dummy";
      const address = dummyEmail;

      localStorage.setItem("authToken", JSON.stringify({ address, chain }));
      document.cookie = `auth-token=${JSON.stringify({ address, chain })}; path=/; max-age=86400`;
      localStorage.setItem("walletAddress", address);

      toast({
        title: "Dummy Login Successful",
        description: `Logged in with ${address}`,
      });

      setIsOpen(false);
      setShowForm(null);
      setDummyEmail("");
      setConnectingWallet(null);
      router.push("/dashboard");
    } catch (err: any) {
      toast({
        title: "Dummy Login Failed",
        description: `Failed to login: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setConnectingWallet(null);
    }
  };

  const handleHashpackLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnectingWallet("hashpack");

    try {
      if (!hederaAccountId || !/^\d+\.\d+\.\d+$/.test(hederaAccountId)) {
        throw new Error("Please enter a valid Hedera account ID (e.g., 0.0.123456)");
      }

      await handleConnect({ id: "hashpack", chain: "hedera", name: "HashPack" } as any);
    } catch (err: any) {
      toast({
        title: "HashPack Connection Failed",
        description: `Failed to connect: ${err.message}`,
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
            Choose a wallet or use email for testing with Dummy Login.
          </DialogDescription>
        </DialogHeader>

        {showForm === "dummy" ? (
          <form onSubmit={handleDummyLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dummy-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dummy-email"
                  type="email"
                  placeholder="Enter your email"
                  value={dummyEmail}
                  onChange={(e) => setDummyEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={connectingWallet === "dummy"}>
              {connectingWallet === "dummy" ? "Logging in..." : "Login with Email"}
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
        ) : showForm === "hashpack" ? (
          <form onSubmit={handleHashpackLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hedera-account">Hedera Account ID</Label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="hedera-account"
                  placeholder="e.g., 0.0.123456"
                  value={hederaAccountId}
                  onChange={(e) => setHederaAccountId(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={connectingWallet === "hashpack"}>
              {connectingWallet === "hashpack" ? "Connecting..." : "Connect HashPack"}
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
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}