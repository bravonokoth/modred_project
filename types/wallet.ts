export interface WalletProvider {
  id: string
  name: string
  icon: string
  chains: SupportedChain[]
  downloadUrl: string
  isInstalled: boolean
  isHardware: boolean
  description: string
}

export type SupportedChain = "hedera" | "ethereum" | "solana"

export interface WalletAccount {
  address: string
  chain: SupportedChain
  balance: TokenBalance
  isConnected: boolean
  lastUpdated: Date
}

export interface TokenBalance {
  native: {
    symbol: string
    amount: number
    usdValue: number
  }
  tokens: Token[]
}

export interface Token {
  symbol: string
  name: string
  amount: number
  usdValue: number
  contractAddress?: string
  tokenId?: string
  mint?: string
  decimals: number
}

export interface Transaction {
  id: string
  hash: string
  type: TransactionType
  status: TransactionStatus
  chain: SupportedChain
  from: string
  to: string
  amount: string
  currency: string
  fee: {
    amount: string
    currency: string
    usdValue: number
  }
  timestamp: Date
  blockNumber?: number
  confirmations?: number
  description?: string
}

export type TransactionType = 
  | "send" 
  | "receive" 
  | "mint" 
  | "burn" 
  | "approve" 
  | "swap" 
  | "stake" 
  | "unstake"

export type TransactionStatus = 
  | "pending" 
  | "completed" 
  | "failed" 
  | "cancelled"

export interface WalletConnection {
  walletId: string
  accounts: WalletAccount[]
  connectedAt: Date
  lastActiveAt: Date
  permissions: WalletPermission[]
}

export interface WalletPermission {
  type: PermissionType
  granted: boolean
  grantedAt: Date
}

export type PermissionType = 
  | "read_balance" 
  | "send_transactions" 
  | "sign_messages" 
  | "access_tokens"

export interface WalletState {
  connections: Map<string, WalletConnection>
  activeWallet: string | null
  isConnecting: boolean
  error: string | null
}

export interface ChainConfig {
  id: string
  name: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
  testnet: boolean
}

export interface WalletError {
  code: string
  message: string
  details?: any
}

export interface SignMessageRequest {
  message: string
  address: string
  chain: SupportedChain
}

export interface SignMessageResponse {
  signature: string
  address: string
  message: string
  timestamp: Date
}