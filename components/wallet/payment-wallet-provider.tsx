"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface PaymentWalletContextType {
  balance: number
  isLoading: boolean
  processPayment: (amount: number, recipient: string, description: string) => Promise<boolean>
  addFunds: (amount: number) => Promise<boolean>
  getTransactionHistory: () => Transaction[]
}

interface Transaction {
  id: string
  type: "payment" | "deposit" | "refund"
  amount: number
  recipient?: string
  description: string
  status: "completed" | "pending" | "failed"
  timestamp: Date
}

const PaymentWalletContext = createContext<PaymentWalletContextType | undefined>(undefined)

export const usePaymentWallet = () => {
  const context = useContext(PaymentWalletContext)
  if (!context) {
    throw new Error("usePaymentWallet must be used within PaymentWalletProvider")
  }
  return context
}

interface PaymentWalletProviderProps {
  children: ReactNode
}

export function PaymentWalletProvider({ children }: PaymentWalletProviderProps) {
  const [balance, setBalance] = useState(100.0) // Start with $100 for testing
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx_1",
      type: "deposit",
      amount: 100.0,
      description: "Initial deposit",
      status: "completed",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ])
  const { toast } = useToast()

  useEffect(() => {
    // Load balance from localStorage
    const savedBalance = localStorage.getItem("payment_wallet_balance")
    if (savedBalance) {
      setBalance(parseFloat(savedBalance))
    }

    // Load transactions from localStorage
    const savedTransactions = localStorage.getItem("payment_wallet_transactions")
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions).map((tx: any) => ({
          ...tx,
          timestamp: new Date(tx.timestamp),
        }))
        setTransactions(parsed)
      } catch (error) {
        console.error("Failed to parse saved transactions:", error)
      }
    }
  }, [])

  const saveToStorage = (newBalance: number, newTransactions: Transaction[]) => {
    localStorage.setItem("payment_wallet_balance", newBalance.toString())
    localStorage.setItem("payment_wallet_transactions", JSON.stringify(newTransactions))
  }

  const processPayment = async (amount: number, recipient: string, description: string): Promise<boolean> => {
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Payment amount must be greater than 0",
        variant: "destructive",
      })
      return false
    }

    if (amount > balance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance for this payment",
        variant: "destructive",
      })
      return false
    }

    setIsLoading(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newBalance = balance - amount
      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: "payment",
        amount,
        recipient,
        description,
        status: "completed",
        timestamp: new Date(),
      }

      const newTransactions = [newTransaction, ...transactions]
      
      setBalance(newBalance)
      setTransactions(newTransactions)
      saveToStorage(newBalance, newTransactions)

      toast({
        title: "Payment Successful",
        description: `$${amount.toFixed(2)} sent to ${recipient}`,
      })

      return true
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const addFunds = async (amount: number): Promise<boolean> => {
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Deposit amount must be greater than 0",
        variant: "destructive",
      })
      return false
    }

    setIsLoading(true)

    try {
      // Simulate deposit processing
      await new Promise(resolve => setTimeout(resolve, 1500))

      const newBalance = balance + amount
      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: "deposit",
        amount,
        description: "Wallet deposit",
        status: "completed",
        timestamp: new Date(),
      }

      const newTransactions = [newTransaction, ...transactions]
      
      setBalance(newBalance)
      setTransactions(newTransactions)
      saveToStorage(newBalance, newTransactions)

      toast({
        title: "Funds Added",
        description: `$${amount.toFixed(2)} added to your wallet`,
      })

      return true
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "There was an error adding funds to your wallet",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getTransactionHistory = (): Transaction[] => {
    return transactions
  }

  const contextValue: PaymentWalletContextType = {
    balance,
    isLoading,
    processPayment,
    addFunds,
    getTransactionHistory,
  }

  return (
    <PaymentWalletContext.Provider value={contextValue}>
      {children}
    </PaymentWalletContext.Provider>
  )
}