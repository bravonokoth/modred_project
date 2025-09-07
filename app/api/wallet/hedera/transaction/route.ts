// app/api/hedera/transaction/route.ts
import { NextResponse } from "next/server";
import {
  Client,
  TransferTransaction,
  Hbar,
  AccountId,
  PrivateKey,
} from "@hashgraph/sdk";

export async function POST(req: Request) {
  try {
    const { accountId, amount } = await req.json();

    if (!accountId || !amount) {
      return NextResponse.json(
        { status: "error", message: "Missing accountId or amount" },
        { status: 400 }
      );
    }

    // ✅ Load operator creds from env
    const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID!);
    const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY!);

    // ✅ Pick network dynamically
    const client =
      process.env.HEDERA_NETWORK === "mainnet"
        ? Client.forMainnet()
        : Client.forTestnet();

    client.setOperator(operatorId, operatorKey);

    // ✅ Execute transfer
    const txResponse = await new TransferTransaction()
      .addHbarTransfer(operatorId, new Hbar(-amount)) // sender (operator)
      .addHbarTransfer(accountId, new Hbar(amount))   // recipient
      .execute(client);

    const receipt = await txResponse.getReceipt(client);

    return NextResponse.json({
      status: "success",
      txId: txResponse.transactionId.toString(),
      receipt: receipt.status.toString(),
    });
  } catch (error: any) {
    console.error("Transaction error:", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
