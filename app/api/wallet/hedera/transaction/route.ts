// app/api/hedera/transaction/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { accountId, amount } = await req.json();

    if (!accountId || !amount) {
      return NextResponse.json(
        { status: "error", message: "Missing accountId or amount" },
        { status: 400 }
      );
    }

    // Mock transaction for demo purposes
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      status: "success",
      txId: `0.0.${Math.floor(Math.random() * 999999)}@${Date.now()}.${Math.floor(Math.random() * 999999999)}`,
      receipt: "SUCCESS",
    });
  } catch (error: any) {
    console.error("Transaction error:", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
