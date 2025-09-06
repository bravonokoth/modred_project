import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const chain = searchParams.get('chain')

  if (!address || !chain) {
    return NextResponse.json(
      { success: false, error: "Address and chain are required" },
      { status: 400 }
    )
  }

  // Simulate balance fetching
  await new Promise(resolve => setTimeout(resolve, 800))

  // Mock balance data based on chain
  const mockBalances = {
    ethereum: {
      native: { symbol: "ETH", amount: 2.456, usdValue: 5894.40 },
      tokens: [
        { symbol: "USDC", amount: 1250.00, usdValue: 1250.00, address: "0xa0b86a33e6776..." },
        { symbol: "LINK", amount: 45.67, usdValue: 678.90, address: "0x514910771af9..." },
        { symbol: "UNI", amount: 23.45, usdValue: 156.78, address: "0x1f9840a85d5a..." },
      ]
    },
    hedera: {
      native: { symbol: "HBAR", amount: 1250.00, usdValue: 87.50 },
      tokens: [
        { symbol: "SAUCE", amount: 500.00, usdValue: 25.00, tokenId: "0.0.123456" },
        { symbol: "HBARX", amount: 100.00, usdValue: 7.50, tokenId: "0.0.789012" },
      ]
    },
    solana: {
      native: { symbol: "SOL", amount: 12.34, usdValue: 1234.00 },
      tokens: [
        { symbol: "USDC", amount: 800.00, usdValue: 800.00, mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
        { symbol: "RAY", amount: 156.78, usdValue: 89.45, mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R" },
      ]
    }
  }

  const balanceData = mockBalances[chain as keyof typeof mockBalances]

  if (!balanceData) {
    return NextResponse.json(
      { success: false, error: "Unsupported chain" },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      address,
      chain,
      ...balanceData,
      lastUpdated: new Date().toISOString(),
    }
  })
}