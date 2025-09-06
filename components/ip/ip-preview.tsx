"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Tag, Globe } from "lucide-react"

interface IPPreviewProps {
  data: {
    title?: string
    description?: string
    type?: string
    category?: string
    tags?: string
    publicListing?: boolean
  }
  files: File[]
}

export function IPPreview({ data, files }: IPPreviewProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const totalSize = files.reduce((acc, file) => acc + file.size, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {data.title || "Untitled IP"}
          </CardTitle>
          <CardDescription>{data.description || "No description provided"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">IP Type</p>
              <Badge variant="secondary">
                {data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : "Not specified"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Category</p>
              <Badge variant="outline">
                {data.category ? data.category.charAt(0).toUpperCase() + data.category.slice(1) : "Not specified"}
              </Badge>
            </div>
          </div>

          {data.tags && (
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Tags
              </p>
              <div className="flex flex-wrap gap-1">
                {data.tags.split(",").map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString()}
            </div>
            {data.publicListing && (
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                Public Listing
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Attached Files</CardTitle>
          <CardDescription>
            {files.length} file{files.length !== 1 ? "s" : ""} • Total size: {formatFileSize(totalSize)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No files attached</p>
          )}
        </CardContent>
      </Card>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Registration Summary</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Your IP will be registered on the blockchain with an immutable timestamp</li>
          <li>• You will receive an NFT representing ownership of this IP</li>
          <li>• Registration creates a permanent, verifiable record of your intellectual property</li>
          {data.publicListing && <li>• Your IP will be available for public licensing requests</li>}
        </ul>
      </div>
    </div>
  )
}
