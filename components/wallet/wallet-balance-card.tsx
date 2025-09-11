"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Plus, ArrowUpRight, ArrowDownLeft, History } from "lucide-react";
import { useAddress, useBalance, useContract, useNFTBalance } from "@thirdweb-dev/react";
import { useToast } from "@/hooks/use-toast";
import { HederaService } from "@/lib/blockchain/hedera/hedera-service";
import { supportedChains } from "@/lib/thirdweb";
import axios from "axios";

interface Token {
  token_id: string;
  balance: number;
  info: {
    name: string;
    symbol: string;
    type: string;
    decimals: string;
  };
  nftSerialNumbers?: number[];
}

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  description: string;
  amount: number;
  status: "completed" | "pending";
  timestamp: Date;
  unit?: string;
}

export function WalletBalanceCard() {
  const [hederaService, setHederaService] = useState<HederaService | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [authType, setAuthType] = useState<
    "hedera" | "metamask" | "email" | "trustwallet" | "walletconnect" | "coinbase" | "rainbow" | "zerion" | "okx" | "binance" | null
  >(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [hbarBalance, setHbarBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [tokenToAssociate, setTokenToAssociate] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const ethAddress = useAddress();
  const { data: ethBalance } = useBalance();
  const { contract: nftContract } = useContract("0xYourNFTContractAddress"); // Replace with your NFT contract
  const { data: nftBalance } = useNFTBalance(nftContract, ethAddress);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const service = new HederaService();
      setHederaService(service);
      const hederaAccountId = service.getAccountId();
      const authToken = localStorage.getItem("authToken");

      if (authToken) {
        const { address, chain } = JSON.parse(authToken);
        setAccountId(address);
        setAuthType(chain);
        if (chain === "hedera" && hederaAccountId) {
          fetchHederaBalances(hederaAccountId);
          fetchHederaTransactions(hederaAccountId);
        } else if (chain !== "email") {
          fetchEthTransactions(address, chain);
        } else {
          setTransactions(mockTransactions);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  }, [ethAddress]);

  const fetchHederaBalances = async (accountId: string) => {
    if (!hederaService) return;
    try {
      setIsLoading(true);
      const balance = await hederaService.getBalance(accountId);
      setHbarBalance(balance.native.amount);
      setTokens(balance.tokens);
    } catch (error) {
      toast({
        title: "Failed to Fetch Balances",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHederaTransactions = async (accountId: string) => {
    if (!hederaService) return;
    try {
      const txs = await hederaService.getTransactionHistory(accountId);
      setTransactions(txs);
    } catch (error) {
      toast({
        title: "Failed to Fetch Transaction History",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const fetchEthTransactions = async (address: string, chain: string) => {
    try {
      const chainConfig = Object.values(supportedChains).find(c => c.name.toLowerCase().includes(chain));
      if (!chainConfig) throw new Error("Unsupported chain");
      const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
      const apiUrl =
        chainConfig.id === 1 ? `https://api.etherscan.io/api` :
        chainConfig.id === 11155111 ? `https://api-sepolia.etherscan.io/api` :
        chainConfig.id === 137 ? `https://api.polygonscan.com/api` :
        chainConfig.id === 8453 ? `https://api.basescan.org/api` :
        "";
      const response = await axios.get(`${apiUrl}?module=account&action=txlist&address=${address}&sort=desc&apikey=${apiKey}`);
      const txs = response.data.result.slice(0, 10).map((tx: any) => ({
        id: tx.hash,
        type: tx.to.toLowerCase() === address.toLowerCase() ? "deposit" : "withdrawal",
        description: tx.contractAddress ? `Token Transfer` : `ETH Transfer`,
        amount: parseInt(tx.value) / 1e18,
        status: tx.isError === "0" ? "completed" : "pending",
        timestamp: new Date(parseInt(tx.timeStamp) * 1000),
        unit: "ETH",
      }));
      setTransactions(txs);
    } catch (error) {
      toast({
        title: "Failed to Fetch Transaction History",
        description: (error as Error).message,
        variant: "destructive",
      });
      setTransactions(mockTransactions);
    }
  };

  const handleAssociateToken = async () => {
    if (!hederaService || !accountId || !tokenToAssociate) return;
    try {
      const transactionId = await hederaService.associateToken(tokenToAssociate, accountId);
      toast({
        title: "IP Asset Associated",
        description: `Transaction ID: ${transactionId}`,
      });
      setTokenToAssociate("");
      setShowAddFunds(false);
      fetchHederaBalances(accountId);
      fetchHederaTransactions(accountId);
    } catch (error) {
      toast({
        title: "Association Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const mockTransactions: Transaction[] = [
    {
      id: "tx1",
      type: "deposit",
      description: "Added funds for IP purchase",
      amount: 100,
      status: "completed",
      timestamp: new Date(Date.now() - 86400000),
      unit: "USD",
    },
    {
      id: "tx2",
      type: "withdrawal",
      description: "IP license purchase",
      amount: 50,
      status: "completed",
      timestamp: new Date(Date.now() - 172800000),
      unit: "USD",
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Wallet Balance
          </CardTitle>
          <CardDescription>Your available funds and IP assets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading balances...</p>
            </div>
          ) : !accountId ? (
            <p className="text-muted-foreground">Please connect your wallet to view balances.</p>
          ) : authType === "hedera" ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{hbarBalance.toFixed(2)} HBAR</p>
                <p className="text-sm text-muted-foreground">Available Balance</p>
              </div>
              {tokens.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium">IP Assets (NFTs):</p>
                  {tokens
                    .filter(t => t.info.type === "NON_FUNGIBLE_UNIQUE")
                    .map(token => (
                      <div key={token.token_id} className="text-sm">
                        <p>{token.info.name} ({token.info.symbol})</p>
                        <p className="text-muted-foreground">Serials: {token.nftSerialNumbers?.join(", ") || "None"}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : authType === "email" ? (
            <div className="text-center">
              <p className="text-3xl font-bold">$0.00</p>
              <p className="text-sm text-muted-foreground">Email authentication: No blockchain balances available</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{ethBalance?.displayValue || "0.00"} {ethBalance?.symbol || "ETH"}</p>
                <p className="text-sm text-muted-foreground">Available Balance</p>
              </div>
              {nftBalance && nftBalance.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium">IP Assets (NFTs):</p>
                  {nftBalance.map(nft => (
                    <div key={nft.metadata.id} className="text-sm">
                      <p>{nft.metadata.name} (ID: {nft.metadata.id})</p>
                      <p className="text-muted-foreground">Token: {nft.metadata.symbol}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setShowAddFunds(true)}
              disabled={isLoading || authType === "email"}
            >
              <Plus className="h-4 w-4 mr-1" />
              {authType === "hedera" ? "Associate IP Asset" : "Add Funds"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setShowHistory(true)}
              disabled={isLoading}
            >
              <History className="h-4 w-4 mr-1" />
              History
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            {authType === "hedera"
              ? "Secure Hedera wallet for IP asset management"
              : authType === "email"
              ? "Connect a blockchain wallet for full functionality"
              : `Secure ${authType} wallet for IP transactions`}
          </div>
        </CardContent>
      </Card>

      {/* Add Funds Dialog */}
      <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{authType === "hedera" ? "Associate IP Asset" : "Add Funds"}</DialogTitle>
            <DialogDescription>
              {authType === "hedera"
                ? "Associate an IP NFT with your Hedera account"
                : "Add funds to your wallet for IP purchases"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {authType === "hedera" ? (
              <div className="space-y-2">
                <Label htmlFor="tokenId">Token ID</Label>
                <Input
                  id="tokenId"
                  placeholder="0.0.123456"
                  value={tokenToAssociate}
                  onChange={(e) => setTokenToAssociate(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="0.00"
                  value={tokenToAssociate}
                  onChange={(e) => setTokenToAssociate(e.target.value)}
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddFunds(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssociateToken}
                disabled={isLoading || !tokenToAssociate}
                className="flex-1"
              >
                {authType === "hedera" ? "Associate Asset" : "Add Funds"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
            <DialogDescription>Your recent wallet transactions</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {tx.type === "deposit" ? (
                      <ArrowDownLeft className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.timestamp.toLocaleDateString()} {tx.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      {tx.type === "deposit" ? "+" : "-"}{tx.amount} {tx.unit || "USD"}
                    </p>
                    <Badge variant={tx.status === "completed" ? "default" : "secondary"} className="text-xs">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}