import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, chain, from, to, amount, tokenAddress, data } = body

    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock transaction response
    const mockTransaction = {
      success: true,
      data: {
        transactionId: `tx_${Math.random().toString(36).substr(2, 9)}`,
        hash: generateMockHash(chain),
        from,
        to,
        amount,
        chain,
        type,
        status: "completed",
        blockNumber: Math.floor(Math.random() * 1000000),
        gasUsed: chain === "ethereum" ? "21000" : undefined,
        fee: getMockFee(chain),
        timestamp: new Date().toISOString(),
      }
    }

    return NextResponse.json(mockTransaction)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Transaction failed" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const chain = searchParams.get('chain')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  // Mock transaction history
  const mockTransactions = [
    {
      id: "tx_1",
      hash: "0xabc123def456...",
      type: "receive",
      amount: "0.523 ETH",
      from: "0x9876543210987654321098765432109876543210",
      to: address,
      status: "completed",
      timestamp: "2024-01-22T10:30:00Z",
      chain: "ethereum",
      description: "IP Royalty Payment",
    },
    {
      id: "tx_2", 
      hash: "0xdef456ghi789...",
      type: "send",
      amount: "0.1 ETH",
      from: address,
      to: "0x1357924680135792468013579246801357924680",
      status: "completed", 
      timestamp: "2024-01-20T15:45:00Z",
      chain: "ethereum",
      description: "License Purchase",
    },
    {
      id: "tx_3",
      hash: "0.0.123456@1642567890.123456789",
      type: "receive",
      amount: "125 HBAR", 
      from: "0.0.789012",
      to: address,
      status: "completed",
      timestamp: "2024-01-18T09:20:00Z",
      chain: "hedera",
      description: "Registration Fee Refund",
    },
  ]

  // Apply pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedTransactions = mockTransactions.slice(startIndex, endIndex)

  return NextResponse.json({
    success: true,
    data: {
      transactions: paginatedTransactions,
      pagination: {
        page,
        limit,
        total: mockTransactions.length,
        totalPages: Math.ceil(mockTransactions.length / limit),
      }
    }
  })
}

function generateMockHash(chain: string): string {
  switch (chain) {
    case "ethereum":
    case "solana":
      return `0x${Math.random().toString(16).substr(2, 64)}`
    case "hedera":
      return `0.0.${Math.floor(Math.random() * 999999)}@${Date.now()}.${Math.floor(Math.random() * 999999999)}`
    default:
      return `${Math.random().toString(36).substr(2, 32)}`
  }
}

function getMockFee(chain: string) {
  switch (chain) {
    case "ethereum":
      return { amount: "0.002 ETH", usd: 4.80 }
    case "hedera":
      return { amount: "0.05 HBAR", usd: 0.004 }
    case "solana":
      return { amount: "0.000005 SOL", usd: 0.0005 }
    default:
      return { amount: "0", usd: 0 }
  }
}