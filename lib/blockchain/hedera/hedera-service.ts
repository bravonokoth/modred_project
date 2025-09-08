"use client";

export class HederaService {
  constructor() {
    // No client initialization needed for mock implementation
  }

  async connect(): Promise<string> {
    throw new Error("Use HederaWalletProvider for connection");
  }

  async getBalance(accountId: string) {
    try {
      const mockBalance = Math.random() * 1000;
      return {
        native: {
          symbol: "HBAR",
          amount: mockBalance,
          usdValue: mockBalance * 0.07,
        },
        tokens: [],
      };
    } catch (error) {
      throw new Error(`Failed to fetch Hedera balance: ${(error as Error).message}`);
    }
  }

  async sendTransaction(transaction: any) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        transactionId: `0.0.${Math.floor(Math.random() * 999999)}@${Date.now()}.${Math.floor(Math.random() * 999999999)}`,
        status: "SUCCESS",
      };
    } catch (error) {
      throw new Error(`Hedera transaction failed: ${(error as Error).message}`);
    }
  }

  async mintIPNFT(ipData: any) {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const tokenId = `0.0.${Math.floor(Math.random() * 999999)}`;
      return {
        tokenId,
        transactionId: `0.0.${Math.floor(Math.random() * 999999)}@${Date.now()}.${Math.floor(Math.random() * 999999999)}`,
        contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`, // Mock contract address
        status: "SUCCESS",
        metadata: {
          name: ipData.title,
          description: ipData.description,
          type: ipData.type,
          category: ipData.category,
        },
      };
    } catch (error) {
      throw new Error(`Failed to mint IP NFT on Hedera: ${(error as Error).message}`);
    }
  }

  async transferIPNFT(tokenId: string, from: string, to: string) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        transactionId: `0.0.${Math.floor(Math.random() * 999999)}@${Date.now()}.${Math.floor(Math.random() * 999999999)}`,
        status: "SUCCESS",
      };
    } catch (error) {
      throw new Error(`Failed to transfer IP NFT on Hedera: ${(error as Error).message}`);
    }
  }

  async signMessage(message: string, accountId: string): Promise<string> {
    throw new Error("Use HederaWalletProvider for message signing");
  }

  getNetworkInfo() {
    const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK === "mainnet" ? "mainnet" : "testnet";
    return {
      network,
      name: network === "mainnet" ? "Hedera Mainnet" : "Hedera Testnet",
      currency: "HBAR",
      explorerUrl: `https://hashscan.io/${network}`,
    };
  }
}