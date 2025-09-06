import { MultiChainService, SupportedChain } from "./blockchain/multi-chain"

export interface WalletConnection {
  id: string
  name: string
  address: string
  chain: SupportedChain
  balance: any
  isConnected: boolean
  connectedAt: Date
}

export interface TransactionRequest {
  chain: SupportedChain
  type: "send" | "receive" | "mint" | "transfer"
  from: string
  to: string
  amount?: string
  tokenId?: string
  data?: any
}

export class WalletManager {
  private multiChainService: MultiChainService
  private connections: Map<string, WalletConnection> = new Map()

  constructor() {
    this.multiChainService = new MultiChainService()
  }

  async connectWallet(walletType: string, chain: SupportedChain): Promise<WalletConnection> {
    try {
      const service = this.multiChainService.getService(chain)
      const address = await service.connect()
      const balance = await service.getBalance(address)

      const connection: WalletConnection = {
        id: `${walletType}_${chain}_${address}`,
        name: walletType,
        address,
        chain,
        balance,
        isConnected: true,
        connectedAt: new Date(),
      }

      this.connections.set(connection.id, connection)
      return connection
    } catch (error) {
      throw new Error(`Failed to connect ${walletType} wallet: ${error}`)
    }
  }

  async disconnectWallet(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId)
    if (connection) {
      connection.isConnected = false
      this.connections.delete(connectionId)
    }
  }

  async getWalletBalance(connectionId: string) {
    const connection = this.connections.get(connectionId)
    if (!connection) {
      throw new Error("Wallet not connected")
    }

    const service = this.multiChainService.getService(connection.chain)
    const balance = await service.getBalance(connection.address)
    
    // Update cached balance
    connection.balance = balance
    this.connections.set(connectionId, connection)
    
    return balance
  }

  async sendTransaction(connectionId: string, transaction: TransactionRequest) {
    const connection = this.connections.get(connectionId)
    if (!connection) {
      throw new Error("Wallet not connected")
    }

    const service = this.multiChainService.getService(connection.chain)
    return await service.sendTransaction(transaction)
  }

  async mintIPNFT(connectionId: string, ipData: any) {
    const connection = this.connections.get(connectionId)
    if (!connection) {
      throw new Error("Wallet not connected")
    }

    const service = this.multiChainService.getService(connection.chain)
    return await service.mintIPNFT(ipData)
  }

  getConnectedWallets(): WalletConnection[] {
    return Array.from(this.connections.values()).filter(conn => conn.isConnected)
  }

  getWalletByChain(chain: SupportedChain): WalletConnection | undefined {
    return Array.from(this.connections.values()).find(
      conn => conn.chain === chain && conn.isConnected
    )
  }

  getTotalPortfolioValue(): number {
    return Array.from(this.connections.values())
      .filter(conn => conn.isConnected)
      .reduce((total, conn) => {
        const nativeValue = conn.balance?.native?.usdValue || 0
        const tokenValue = conn.balance?.tokens?.reduce((sum: number, token: any) => sum + (token.usdValue || 0), 0) || 0
        return total + nativeValue + tokenValue
      }, 0)
  }

  isValidAddress(chain: SupportedChain, address: string): boolean {
    return this.multiChainService.isValidAddress(chain, address)
  }

  getSupportedChains(): SupportedChain[] {
    return this.multiChainService.getSupportedChains()
  }
}

export const walletManager = new WalletManager()