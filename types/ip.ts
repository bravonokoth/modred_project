export interface IPAsset {
  id: string
  title: string
  description: string
  type: IPType
  category: IPCategory
  owner: string
  tags: string[]
  files: IPFile[]
  metadata: IPMetadata
  blockchain: BlockchainNetwork
  tokenId?: string
  contractAddress?: string
  status: IPStatus
  createdAt: Date
  updatedAt: Date
  publicListing: boolean
  licensing: LicensingTerms
}

export type IPType = 
  | "patent" 
  | "trademark" 
  | "copyright" 
  | "design" 
  | "trade-secret"

export type IPCategory = 
  | "software" 
  | "design" 
  | "music" 
  | "art" 
  | "literature" 
  | "invention" 
  | "brand" 
  | "other"

export type IPStatus = 
  | "draft" 
  | "pending" 
  | "registered" 
  | "rejected" 
  | "expired"

export type BlockchainNetwork = 
  | "hedera" 
  | "ethereum" 
  | "solana"

export interface IPFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  hash: string
  uploadedAt: Date
}

export interface IPMetadata {
  version: string
  jurisdiction: string
  registrationNumber?: string
  expirationDate?: Date
  renewalRequired: boolean
  legalStatus: string
  priorArt?: string[]
  relatedIPs?: string[]
}

export interface LicensingTerms {
  available: boolean
  basePrice: string
  royaltyRate: number
  exclusivityOptions: ExclusivityOption[]
  territoryRestrictions: string[]
  usageRestrictions: string[]
  duration: LicenseDuration
}

export type ExclusivityOption = 
  | "exclusive" 
  | "non-exclusive" 
  | "limited"

export interface LicenseDuration {
  type: "fixed" | "perpetual" | "renewable"
  period?: string
  renewalTerms?: string
}

export interface IPRegistrationRequest {
  title: string
  description: string
  type: IPType
  category: IPCategory
  tags: string[]
  files: File[]
  blockchain: BlockchainNetwork
  publicListing: boolean
  licensingTerms?: Partial<LicensingTerms>
}

export interface IPLicense {
  id: string
  ipAssetId: string
  licensee: string
  licensor: string
  type: ExclusivityOption
  territory: string
  duration: string
  price: string
  royaltyRate: number
  status: LicenseStatus
  startDate: Date
  endDate?: Date
  terms: string
  blockchain: BlockchainNetwork
  contractAddress?: string
  createdAt: Date
}

export type LicenseStatus = 
  | "pending" 
  | "active" 
  | "expired" 
  | "terminated" 
  | "disputed"

export interface IPDispute {
  id: string
  title: string
  description: string
  category: DisputeCategory
  plaintiff: string
  defendant: string
  ipAssetId: string
  status: DisputeStatus
  priority: DisputePriority
  evidence: DisputeEvidence[]
  responses: DisputeResponse[]
  resolution?: string
  filedAt: Date
  resolvedAt?: Date
  dueDate?: Date
}

export type DisputeCategory = 
  | "copyright-infringement" 
  | "patent-infringement" 
  | "trademark-dispute" 
  | "trade-secret-theft" 
  | "licensing-violation"

export type DisputeStatus = 
  | "filed" 
  | "under-review" 
  | "awaiting-response" 
  | "response-required" 
  | "escalated" 
  | "resolved-settlement" 
  | "resolved-dismissed"

export type DisputePriority = 
  | "low" 
  | "medium" 
  | "high" 
  | "critical"

export interface DisputeEvidence {
  id: string
  type: "document" | "image" | "video" | "audio" | "other"
  name: string
  url: string
  description: string
  uploadedBy: string
  uploadedAt: Date
}

export interface DisputeResponse {
  id: string
  author: string
  content: string
  attachments: DisputeEvidence[]
  submittedAt: Date
}

export interface RoyaltyPayment {
  id: string
  ipAssetId: string
  licenseId: string
  payer: string
  recipient: string
  amount: string
  currency: string
  blockchain: BlockchainNetwork
  transactionHash: string
  status: PaymentStatus
  paidAt: Date
  period: {
    start: Date
    end: Date
  }
}

export type PaymentStatus = 
  | "pending" 
  | "completed" 
  | "failed" 
  | "refunded"