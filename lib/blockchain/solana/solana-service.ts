"use client";

export class SolanaService {
  private connection: any = null;

  constructor() {
    if (typeof window !== "undefined" && (window as any).solana) {
      this.connection = (window as any).solana;
    }
  }

  async connect(): Promise<string> {
    if (!this.connection) {
      throw new Error("Phantom wallet not installed");
    }
    try {
      const response = await this.connection.connect();
      if (!response || !response.publicKey) {
        throw new Error("Failed to get Solana public key");
      }
      return response.publicKey.toString();
    } catch (error) {
      if ((error as any).code === 4001) {
        throw new Error("User rejected the connection request");
      }
      throw new Error(`Failed to connect to Phantom: ${(error as Error).message}`);
    }
  }

  async getBalance(address: string) {
    try {
      // Mock balance for demo
      const mockBalance = Math.random() * 100;
      return {
        native: {
          symbol: "SOL",
          amount: mockBalance,
          usdValue: mockBalance * 130, // Approximate SOL price
        },
        tokens: [],
      };
    } catch (error) {
      throw new Error(`Failed to fetch Solana balance: ${(error as Error).message}`);
    }
  }

  async sendTransaction(transaction: any) {
    try {
      // Mock transaction for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        transactionHash: `sig_${Math.random().toString(36).substr(2, 9)}`,
        status: "completed",
      };
    } catch (error) {
      throw new Error(`Solana transaction failed: ${(error as Error).message}`);
    }
  }

  async mintIPNFT(ipData: any) {
    try {
      // Mock NFT minting for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      const tokenId = `sol_nft_${Math.random().toString(36).substr(2, 9)}`;
      return {
        tokenId,
        transactionHash: `sig_${Math.random().toString(36).substr(2, 9)}`,
        status: "completed",
        metadata: {
          name: ipData.title,
          description: ipData.description,
          type: ipData.type,
          category: ipData.category,
        },
      };
    } catch (error) {
      throw new Error(`Failed to mint IP NFT on Solana: ${(error as Error).message}`);
    }
  }

  async transferIPNFT(tokenId: string, from: string, to: string) {
    try {
      // Mock transfer for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        transactionHash: `sig_${Math.random().toString(36).substr(2, 9)}`,
        status: "completed",
      };
    } catch (error) {
      throw new Error(`Failed to transfer IP NFT on Solana: ${(error as Error).message}`);
    }
  }

  async signMessage(message: string, address: string): Promise<string> {
    if (!this.connection) {
      throw new Error("Solana provider not available");
    }
    try {
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await this.connection.signMessage(encodedMessage, address);
      return signature;
    } catch (error) {
      throw new Error(`Message signing failed: ${(error as Error).message}`);
    }
  }

  getNetworkInfo() {
    return {
      chainId: "solana-mainnet",
      name: "Solana Mainnet",
      currency: "SOL",
      explorerUrl: "https://explorer.solana.com",
    };
  }
}