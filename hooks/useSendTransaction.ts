"use client";

import { useState } from "react";

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

  const sendTransaction = async (accountId: string, amount: number) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await fetch("/api/hedera/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, amount }),
      });

      const data: TransactionResult = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Transaction failed");
      }

      setResult(data);
      return data;
    } catch (err: any) {
      console.error("Transaction error:", err);
      setError(err.message || "Failed to send transaction");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendTransaction, loading, error, result };
}
