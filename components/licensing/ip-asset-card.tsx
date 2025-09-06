"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Shield, Eye, Scale } from "lucide-react"
import Image from "next/image"

interface IPAssetCardProps {
  asset: {
    id: string
    title: string
    description: string
    type: string
    category: string
    owner: string
    price: string
    royaltyRate: string
    tags: string[]
    image: string
    licensesIssued: number
    rating: number
    verified: boolean
  }
  onLicenseRequest: () => void
}

export function IPAssetCard({ asset, onLicenseRequest }: IPAssetCardProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/20">
      <div className="relative">
        <Image
          src={asset.image || "/placeholder.svg"}
          alt={asset.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {asset.verified && (
          <Badge className="absolute top-2 right-2 bg-primary">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="font-heading text-lg line-clamp-1">{asset.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">{asset.description}</CardDescription>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {asset.category.charAt(0).toUpperCase() + asset.category.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{asset.owner.slice(2, 4).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{formatAddress(asset.owner)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{asset.rating}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {asset.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {asset.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{asset.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">License Price</p>
            <p className="font-semibold">{asset.price}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Royalty Rate</p>
            <p className="font-semibold">{asset.royaltyRate}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Scale className="h-4 w-4" />
            <span>{asset.licensesIssued} licenses</span>
          </div>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </div>

        <Button onClick={onLicenseRequest} className="w-full">
          Request License
        </Button>
      </CardContent>
    </Card>
  )
}
