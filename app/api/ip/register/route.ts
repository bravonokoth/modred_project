import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Simulate blockchain registration
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock response data
    const mockResponse = {
      success: true,
      data: {
        id: `ip_${Date.now()}`,
        title: body.title,
        description: body.description,
        type: body.type,
        category: body.category,
        tags: body.tags?.split(',').map((tag: string) => tag.trim()) || [],
        tokenId: `NFT_${Math.random().toString(36).substr(2, 9)}`,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        registrationDate: new Date().toISOString(),
        status: "completed",
        blockchain: "hedera", // or ethereum, solana based on user preference
        publicListing: body.publicListing || false,
      }
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Mock user's registered IPs
  const mockIPs = [
    {
      id: "ip_1",
      title: "Mobile App Design System",
      description: "Complete design system for mobile applications",
      type: "design",
      category: "software",
      tokenId: "NFT_abc123",
      registrationDate: "2024-01-15T10:30:00Z",
      status: "completed",
      blockchain: "hedera",
    },
    {
      id: "ip_2",
      title: "AI Algorithm Patent",
      description: "Machine learning algorithm for predictive analytics",
      type: "patent", 
      category: "software",
      tokenId: "NFT_def456",
      registrationDate: "2024-01-12T14:20:00Z",
      status: "pending",
      blockchain: "ethereum",
    },
  ]

  return NextResponse.json({ success: true, data: mockIPs })
}