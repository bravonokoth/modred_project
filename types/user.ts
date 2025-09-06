export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  status: UserStatus
  preferences: UserPreferences
  wallets: ConnectedWallet[]
  ipAssets: string[]
  licenses: string[]
  disputes: string[]
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date
  emailVerified: boolean
  twoFactorEnabled: boolean
}

export type UserRole = "user" | "creator" | "enterprise" | "admin"

export type UserStatus = "active" | "suspended" | "pending" | "banned"

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  language: string
  timezone: string
  currency: string
  notifications: NotificationSettings
  privacy: PrivacySettings
  defaultChain: SupportedChain
}

export interface NotificationSettings {
  email: {
    enabled: boolean
    ipUpdates: boolean
    licenseRequests: boolean
    disputeAlerts: boolean
    royaltyPayments: boolean
    systemUpdates: boolean
  }
  push: {
    enabled: boolean
    ipUpdates: boolean
    licenseRequests: boolean
    disputeAlerts: boolean
    royaltyPayments: boolean
  }
  sms: {
    enabled: boolean
    securityAlerts: boolean
    criticalDisputes: boolean
  }
}

export interface PrivacySettings {
  profileVisibility: "public" | "private" | "contacts"
  showIPPortfolio: boolean
  showEarnings: boolean
  allowDirectMessages: boolean
  shareAnalytics: boolean
}

export interface ConnectedWallet {
  id: string
  type: WalletType
  address: string
  chain: SupportedChain
  name: string
  isActive: boolean
  connectedAt: Date
  lastUsedAt: Date
}

export type WalletType = 
  | "metamask" 
  | "hashpack" 
  | "phantom" 
  | "coinbase" 
  | "trust" 
  | "walletconnect" 
  | "rainbow" 
  | "brave" 
  | "exodus" 
  | "ledger"

export interface UserSession {
  userId: string
  sessionId: string
  walletAddress?: string
  chain?: SupportedChain
  expiresAt: Date
  createdAt: Date
  ipAddress: string
  userAgent: string
}

export interface UserActivity {
  id: string
  userId: string
  type: ActivityType
  description: string
  metadata: any
  ipAddress: string
  timestamp: Date
}

export type ActivityType = 
  | "login" 
  | "logout" 
  | "wallet_connect" 
  | "wallet_disconnect" 
  | "ip_register" 
  | "ip_update" 
  | "license_request" 
  | "license_grant" 
  | "dispute_file" 
  | "dispute_respond" 
  | "payment_send" 
  | "payment_receive"

export interface UserStats {
  totalIPAssets: number
  totalLicenses: number
  totalEarnings: number
  totalDisputes: number
  successfulLicenses: number
  averageRating: number
  joinedDate: Date
  lastActiveDate: Date
}

export interface UserProfile {
  user: User
  stats: UserStats
  recentActivity: UserActivity[]
  connectedWallets: ConnectedWallet[]
}

export type SupportedChain = "hedera" | "ethereum" | "solana"