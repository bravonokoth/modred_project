import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const type = searchParams.get('type')
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  // Mock IP listings data
  const mockListings = [
    {
      id: "ip_1",
      title: "Mobile App Design System",
      description: "Complete design system with 200+ components",
      type: "design",
      category: "software", 
      owner: "0x1234567890123456789012345678901234567890",
      price: "0.5 ETH",
      royaltyRate: "5%",
      tags: ["mobile", "design", "ui", "components"],
      image: "/mobile-app-design-system.png",
      licensesIssued: 12,
      rating: 4.8,
      verified: true,
      createdAt: "2024-01-15T10:30:00Z",
      blockchain: "ethereum",
    },
    {
      id: "ip_2", 
      title: "AI Algorithm Patent",
      description: "Machine learning algorithm for financial markets",
      type: "patent",
      category: "software",
      owner: "0x8765432109876543210987654321098765432109",
      price: "2.0 ETH", 
      royaltyRate: "10%",
      tags: ["ai", "machine-learning", "finance", "algorithm"],
      image: "/ai-algorithm-visualization.png",
      licensesIssued: 3,
      rating: 4.9,
      verified: true,
      createdAt: "2024-01-12T14:20:00Z",
      blockchain: "hedera",
    },
    {
      id: "ip_3",
      title: "Music Composition Library", 
      description: "Original instrumental compositions for games",
      type: "copyright",
      category: "music",
      owner: "0x5432109876543210987654321098765432109876",
      price: "0.8 ETH",
      royaltyRate: "8%", 
      tags: ["music", "instrumental", "gaming", "multimedia"],
      image: "/music-composition-studio.png",
      licensesIssued: 18,
      rating: 4.7,
      verified: true,
      createdAt: "2024-01-10T09:15:00Z",
      blockchain: "solana",
    },
  ]

  // Apply filters
  let filteredListings = mockListings

  if (type && type !== 'all') {
    filteredListings = filteredListings.filter(ip => ip.type === type)
  }

  if (category && category !== 'all') {
    filteredListings = filteredListings.filter(ip => ip.category === category)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredListings = filteredListings.filter(ip => 
      ip.title.toLowerCase().includes(searchLower) ||
      ip.description.toLowerCase().includes(searchLower) ||
      ip.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  // Apply pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedListings = filteredListings.slice(startIndex, endIndex)

  return NextResponse.json({
    success: true,
    data: {
      listings: paginatedListings,
      pagination: {
        page,
        limit,
        total: filteredListings.length,
        totalPages: Math.ceil(filteredListings.length / limit),
      }
    }
  })
}