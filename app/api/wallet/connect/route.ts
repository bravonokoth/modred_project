import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletType, address, signature, message } = body

    // Simulate wallet connection verification
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock response based on wallet type
    const mockResponse = {
      success: true,
      data: {
        walletType,
        address,
        chain: getChainForWallet(walletType),
        balance: getMockBalance(walletType),
        connectedAt: new Date().toISOString(),
        sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
      }
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Connection failed" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  // Simulate wallet disconnection
  await new Promise(resolve => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    message: "Wallet disconnected successfully"
  })
}

function getChainForWallet(walletType: string): string {
  switch (walletType) {
    case "metamask":
    case "rainbow":
      return "ethereum"
    case "hashpack":
      return "hedera"
    case "phantom":
      return "solana"
    case "coinbase":
    case "trust":
    case "walletconnect":
    case "brave":
    case "exodus":
    case "ledger":
      return "multi-chain"
    default:
      return "unknown"
  }
}

function getMockBalance(walletType: string) {
  const balances = {
    metamask: { native: "2.456 ETH", usd: 5894.40 },
    hashpack: { native: "1,250 HBAR", usd: 87.50 },
    phantom: { native: "12.34 SOL", usd: 1234.00 },
    coinbase: { native: "1.234 ETH", usd: 2961.60 },
    trust: { native: "0.567 ETH", usd: 1360.80 },
    walletconnect: { native: "0.890 ETH", usd: 2136.00 },
    rainbow: { native: "3.210 ETH", usd: 7704.00 },
    brave: { native: "0.345 ETH", usd: 828.00 },
    exodus: { native: "1.678 ETH", usd: 4027.20 },
    ledger: { native: "5.432 ETH", usd: 13036.80 },
  }

  return balances[walletType as keyof typeof balances] || { native: "0 ETH", usd: 0 }
}