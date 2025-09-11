"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TransactionResult {
  status: string;
  txId?: string;
  receipt?: string;
  message?: string;
}

export function useSendTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);
  const { toast } = useToast();

  const sendTransaction = async (accountId: string, amount: number) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      // Validate inputs
      if (!accountId || !/^\d+\.\d+\.\d+$/.test(accountId)) {
        throw new Error("Invalid Hedera account ID");
      }

      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      const res = await fetch("/api/wallet/hedera/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, amount }),
      });

      const data: TransactionResult = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Transaction failed");
      }

      setResult(data);
      
      toast({
        title: "Transaction Successful",
        description: `Successfully sent ${amount} HBAR to ${accountId}`,
      });
      
      return data;
    } catch (err: any) {
      console.error("Transaction error:", err);
      const errorMessage = err.message || "Failed to send transaction";
      setError(errorMessage);
      
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendTransaction, loading, error, result };
}