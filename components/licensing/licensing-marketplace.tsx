"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IPAssetCard } from "./ip-asset-card"
import { LicenseRequestDialog } from "./license-request-dialog"
import { MyLicensesTab } from "./my-licenses-tab"
import { PaymentDialog } from "@/components/wallet/payment-dialog"
import { Search, SlidersHorizontal } from "lucide-react"

// Mock data for IP assets
const mockIPAssets = [
  {
    id: "1",
    title: "Mobile App Design System",
    description: "Complete design system for mobile applications with 200+ components and design tokens",
    type: "design",
    category: "software",
    owner: "0x1234...5678",
    price: "0.5 ETH",
    royaltyRate: "5%",
    tags: ["mobile", "design", "ui", "components"],
    image: "/mobile-app-design-system.png",
    licensesIssued: 12,
    rating: 4.8,
    verified: true,
  },
  {
    id: "2",
    title: "AI Algorithm Patent",
    description: "Machine learning algorithm for predictive analytics in financial markets",
    type: "patent",
    category: "software",
    owner: "0x8765...4321",
    price: "2.0 ETH",
    royaltyRate: "10%",
    tags: ["ai", "machine-learning", "finance", "algorithm"],
    image: "/ai-algorithm-visualization.png",
    licensesIssued: 3,
    rating: 4.9,
    verified: true,
  },
  {
    id: "3",
    title: "Brand Logo Collection",
    description: "Professional logo designs for tech startups and SaaS companies",
    type: "trademark",
    category: "design",
    owner: "0x9876...1234",
    price: "0.2 ETH",
    royaltyRate: "3%",
    tags: ["logo", "branding", "startup", "tech"],
    image: "/tech-startup-logos-collection.png",
    licensesIssued: 25,
    rating: 4.6,
    verified: false,
  },
  {
    id: "4",
    title: "Music Composition Library",
    description: "Original instrumental compositions for video games and multimedia projects",
    type: "copyright",
    category: "music",
    owner: "0x5432...8765",
    price: "0.8 ETH",
    royaltyRate: "8%",
    tags: ["music", "instrumental", "gaming", "multimedia"],
    image: "/music-composition-studio.png",
    licensesIssued: 18,
    rating: 4.7,
    verified: true,
  },
  {
    id: "5",
    title: "Blockchain Architecture Framework",
    description: "Scalable blockchain architecture for enterprise applications",
    type: "copyright",
    category: "software",
    owner: "0x2468...1357",
    price: "3.5 ETH",
    royaltyRate: "12%",
    tags: ["blockchain", "architecture", "enterprise", "scalability"],
    image: "/blockchain-network-architecture.png",
    licensesIssued: 7,
    rating: 4.9,
    verified: true,
  },
  {
    id: "6",
    title: "Photography Portfolio",
    description: "High-quality stock photography for commercial and editorial use",
    type: "copyright",
    category: "art",
    owner: "0x1357...2468",
    price: "0.3 ETH",
    royaltyRate: "6%",
    tags: ["photography", "stock", "commercial", "editorial"],
    image: "/professional-photography-portfolio.png",
    licensesIssued: 45,
    rating: 4.5,
    verified: true,
  },
]

export function LicensingMarketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [showLicenseDialog, setShowLicenseDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const filteredAssets = mockIPAssets.filter((asset) => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = selectedType === "all" || asset.type === selectedType
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory

    return matchesSearch && matchesType && matchesCategory
  })

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return Number.parseFloat(a.price) - Number.parseFloat(b.price)
      case "price-high":
        return Number.parseFloat(b.price) - Number.parseFloat(a.price)
      case "rating":
        return b.rating - a.rating
      case "recent":
        return b.licensesIssued - a.licensesIssued
      default: // popular
        return b.licensesIssued - a.licensesIssued
    }
  })

  const handleLicenseRequest = (asset: any) => {
    setSelectedAsset(asset)
    setShowLicenseDialog(true)
  }

  const handlePaymentSuccess = () => {
    toast({
      title: "Purchase Successful!",
      description: "You have successfully licensed the IP asset.",
    })
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="my-licenses">My Licenses</TabsTrigger>
          <TabsTrigger value="my-assets">My Assets</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Search className="h-5 w-5" />
                Discover IP Assets
              </CardTitle>
              <CardDescription>Browse and license intellectual property from creators worldwide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="lg:col-span-2">
                  <Input
                    placeholder="Search IP assets, tags, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="IP Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="patent">Patent</SelectItem>
                    <SelectItem value="trademark">Trademark</SelectItem>
                    <SelectItem value="copyright">Copyright</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  {sortedAssets.length} asset{sortedAssets.length !== 1 ? "s" : ""} found
                </p>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* IP Assets Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedAssets.map((asset) => (
              <IPAssetCard key={asset.id} asset={asset} onLicenseRequest={() => handleLicenseRequest(asset)} />
            ))}
          </div>

          {sortedAssets.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">No assets found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse all available assets
                </p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedType("all")
                    setSelectedCategory("all")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-licenses">
          <MyLicensesTab />
        </TabsContent>

        <TabsContent value="my-assets">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">My IP Assets</CardTitle>
              <CardDescription>Manage your registered IP assets and licensing terms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">You haven't registered any IP assets for licensing yet.</p>
                <Button asChild>
                  <a href="/register-ip">Register Your First IP</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* License Request Dialog */}
      <LicenseRequestDialog asset={selectedAsset} open={showLicenseDialog} onOpenChange={setShowLicenseDialog} />
      
      {/* Payment Dialog */}
      <PaymentDialog 
        asset={selectedAsset} 
        open={showPaymentDialog} 
        onOpenChange={setShowPaymentDialog}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
