import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { accountId, amount } = await req.json();

    // Validate inputs
    if (!accountId || !amount) {
      return NextResponse.json(
        { status: "error", message: "Missing accountId or amount" },
        { status: 400 }
      );
    }

    // Validate Hedera account ID format
    if (!/^\d+\.\d+\.\d+$/.test(accountId)) {
      return NextResponse.json(
        { status: "error", message: "Invalid Hedera account ID format" },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { status: "error", message: "Invalid amount" },
        { status: 400 }
      );
    }

    // Simulate Hedera transaction processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock transaction ID in Hedera format
    const transactionId = `0.0.${Math.floor(Math.random() * 999999)}@${Date.now()}.${Math.floor(Math.random() * 999999999)}`;

    return NextResponse.json({
      status: "success",
      txId: transactionId,
      receipt: "SUCCESS",
      message: `Successfully sent ${amount} HBAR to ${accountId}`,
      timestamp: new Date().toISOString(),
      fee: "0.05 HBAR",
      network: process.env.NEXT_PUBLIC_HEDERA_NETWORK || "testnet",
    });
  } catch (error: any) {
    console.error("Hedera transaction error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: error.message || "Transaction processing failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "Hedera transaction endpoint is operational",
    network: process.env.NEXT_PUBLIC_HEDERA_NETWORK || "testnet",
    timestamp: new Date().toISOString(),
  });
}