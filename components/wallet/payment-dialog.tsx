// components/wallet/payment-dialog.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePaymentWallet } from "./payment-wallet-provider";
import { DollarSign, Loader2, Plus } from "lucide-react";
import { IPAsset } from "@/types"; // Adjust the path to your types file

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: IPAsset | null;
  onPaymentSuccess?: () => void;
}

export function PaymentDialog({ open, onOpenChange, asset, onPaymentSuccess }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card">("wallet");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const { balance, isLoading, processPayment, addFunds } = usePaymentWallet();

  // Handle null asset case
  if (!asset) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">No Asset Selected</DialogTitle>
            <DialogDescription>Please select an IP asset to proceed with payment.</DialogDescription>
          </DialogHeader>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  const priceAmount = parseFloat(asset.price.replace(/[^\d.]/g, ""));
  const hasEnoughBalance = balance >= priceAmount;

  const handlePayment = async () => {
    if (!hasEnoughBalance) {
      setShowAddFunds(true);
      return;
    }

    setIsProcessing(true);
    try {
      const success = await processPayment(priceAmount, asset.owner, `License for ${asset.title}`);
      if (success) {
        onPaymentSuccess?.();
        onOpenChange(false);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddFunds = async () => {
    const amount = parseFloat(addAmount);
    if (amount > 0) {
      const success = await addFunds(amount);
      if (success) {
        setShowAddFunds(false);
        setAddAmount("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Complete Payment</DialogTitle>
          <DialogDescription>Purchase license for "{asset.title}"</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Asset Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{asset.title}</CardTitle>
              <CardDescription>License purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Price:</span>
                <span className="text-lg font-bold">${priceAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Balance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-muted-foreground">Available:</span>
                <span className="text-lg font-bold">${balance.toFixed(2)}</span>
              </div>

              {!hasEnoughBalance && (
                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Insufficient balance. You need ${(priceAmount - balance).toFixed(2)} more.
                  </p>
                </div>
              )}

              {!showAddFunds ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => setShowAddFunds(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Funds
                </Button>
              ) : (
                <div className="space-y-3 mt-3">
                  <Label htmlFor="addAmount">Add Amount ($)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="addAmount"
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="0.00"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                    />
                    <Button
                      onClick={handleAddFunds}
                      disabled={isLoading || !addAmount || parseFloat(addAmount) <= 0}
                      size="sm"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddFunds(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Payment Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!hasEnoughBalance || isProcessing || isLoading}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Pay ${priceAmount.toFixed(2)}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}