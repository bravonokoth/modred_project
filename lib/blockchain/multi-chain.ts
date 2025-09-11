// lib/blockchain/multi-chain.ts


export type SupportedChain = "hedera" | "ethereum" | "solana" | "walletconnect" | "dummy";



interface ChainService {
  connect: () => Promise<string>;
  signMessage: (message: string, address: string) => Promise<string>;
  getBalance: (address: string) => Promise<{
    native: { symbol: string; amount: number; usdValue: number };
    tokens: any[];
  }>;
  sendTransaction: (transaction: any) => Promise<{ transactionId?: string; hash?: string; status: string }>;
  mintIPNFT: (ipData: any) => Promise<{
    tokenId: string;
    transactionId?: string;
    transactionHash?: string;
    contractAddress?: string; // Added optional contractAddress
    status: string;
    metadata?: any;
  }>;
  transferIPNFT: (tokenId: string, from: string, to: string) => Promise<{
    transactionId?: string;
    transactionHash?: string;
    status: string;
  }>;
}

export interface ChainConfig {
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export const CHAIN_CONFIGS: Record<SupportedChain, ChainConfig> = {
  hedera: {
    name: "Hedera Hashgraph",
    nativeCurrency: {
      name: "HBAR",
      symbol: "HBAR",
      decimals: 8,
    },
    rpcUrls: ["https://testnet.hashio.io/api"],
    blockExplorerUrls: ["https://hashscan.io/testnet"],
  },
  ethereum: {
    name: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3/"],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  solana: {
    name: "Solana",
    nativeCurrency: {
      name: "SOL",
      symbol: "SOL",
      decimals: 9,
    },
    rpcUrls: ["https://api.mainnet-beta.solana.com"],
    blockExplorerUrls: ["https://explorer.solana.com"],
  },
  walletconnect: {
    name: "WalletConnect",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3/"],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  dummy: {
    name: "Dummy",
    nativeCurrency: {
      name: "Dummy",
      symbol: "DUM",
      decimals: 0,
    },
    rpcUrls: [],
    blockExplorerUrls: [],
  },
};

export class MultiChainService {
  private services: Map<SupportedChain, ChainService> = new Map();

  constructor() {
    // Only initialize services on client side
    if (typeof window !== "undefined") {
      this.initializeServices();
    }
  }

  private async initializeServices() {
    try {
      // Dynamically import services to avoid server-side issues
      const [
        { EthereumService },
        { SolanaService },
        { WalletConnectService },
        { HederaService }
      ] = await Promise.all([
        import("./ethereum/ethereum-service"),
        import("./solana/solana-service"),
        import("./walletconnect/walletconnect-service"),
        import("./hedera/hedera-service")
      ]);

      this.services.set("ethereum", new EthereumService());
      this.services.set("solana", new SolanaService());
      this.services.set("walletconnect", new WalletConnectService());
      this.services.set("hedera", new HederaService());
    } catch (error) {
      console.error("Failed to initialize blockchain services:", error);
      // Continue without services for demo purposes
    }
  }

  getService(chain: SupportedChain): ChainService | null {
    if (chain === "dummy") {
      return null;
    }
    return this.services.get(chain) || null;
  }

  async connect(chain: SupportedChain, email?: string): Promise<string> {
    if (chain === "dummy") {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid email for dummy login");
      }
      return email;
    }
    
    if (chain === "hedera") {
      // Use the HederaService for connection
      const service = this.getService(chain);
      if (!service) {
        throw new Error("Hedera service not available");
      }
      return await service.connect();
    }
    
    const service = this.getService(chain);
    if (!service) {
      if (typeof window === "undefined") {
        throw new Error("Wallet connection only available on client side");
      }
      throw new Error(`Service not initialized for chain: ${chain}`);
    }
    return await service.connect();
  }

  async signMessage(chain: SupportedChain, message: string, address: string): Promise<string> {
    if (chain === "dummy") {
      return `dummy_signature_${address}`;
    }
    const service = this.getService(chain);
    if (!service) {
      throw new Error(`Service not available for chain: ${chain}`);
    }
    return await service.signMessage(message, address);
  }

  async getBalance(chain: SupportedChain, address: string) {
    if (chain === "dummy") {
      return {
        native: {
          symbol: "DUM",
          amount: 100,
          usdValue: 100,
        },
        tokens: [],
      };
    }
    const service = this.getService(chain);
    if (!service) {
      throw new Error(`Service not available for chain: ${chain}`);
    }
    return await service.getBalance(address);
  }

  async sendTransaction(chain: SupportedChain, transaction: any) {
    if (chain === "dummy") {
      return {
        transactionId: `dummy_tx_${Math.random().toString(36).substr(2, 9)}`,
        status: "completed",
      };
    }
    const service = this.getService(chain);
    if (!service) {
      throw new Error(`Service not available for chain: ${chain}`);
    }
    return await service.sendTransaction(transaction);
  }

  async mintIPNFT(chain: SupportedChain, ipData: any) {
    if (chain === "dummy") {
      return {
        tokenId: `dummy_nft_${Math.random().toString(36).substr(2, 9)}`,
        transactionId: `dummy_tx_${Math.random().toString(36).substr(2, 9)}`,
        status: "completed",
        metadata: ipData,
      };
    }
    const service = this.getService(chain);
    if (!service) {
      throw new Error(`Service not available for chain: ${chain}`);
    }
    return await service.mintIPNFT(ipData);
  }

  async transferIPNFT(chain: SupportedChain, tokenId: string, from: string, to: string) {
    if (chain === "dummy") {
      return {
        transactionId: `dummy_tx_${Math.random().toString(36).substr(2, 9)}`,
        status: "completed",
      };
    }
    const service = this.getService(chain);
    if (!service) {
      throw new Error(`Service not available for chain: ${chain}`);
    }
    return await service.transferIPNFT(tokenId, from, to);
  }

  getSupportedChains(): SupportedChain[] {
    return Object.keys(CHAIN_CONFIGS) as SupportedChain[];
  }

  getChainConfig(chain: SupportedChain): ChainConfig {
    return CHAIN_CONFIGS[chain];
  }

  isValidAddress(chain: SupportedChain, address: string): boolean {
    if (chain === "dummy") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address);
    }
    switch (chain) {
      case "hedera":
        return /^0\.0\.\d+$/.test(address);
      case "ethereum":
      case "walletconnect":
        return /^0x[a-fA-F0-9]{40}$/.test(address);
      case "solana":
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
      default:
        return false;
    }
  }
}

export const multiChainService = new MultiChainService();