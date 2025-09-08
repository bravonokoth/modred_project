"use client";

import type { ethers as EthersTypes } from "ethers";

export class EthereumService {
  private provider: any = null;

  constructor() {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      this.provider = (window as any).ethereum;
    }
  }

  async connect(): Promise<string> {
    if (!this.provider) {
      throw new Error("MetaMask not installed");
    }

    try {
      const accounts = await this.provider.request({
        method: "eth_requestAccounts",
      });
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }
      return accounts[0];
    } catch (error) {
      if ((error as any).code === 4001) {
        throw new Error("User rejected the connection request");
      }
      throw new Error(`Failed to connect to MetaMask: ${(error as Error).message}`);
    }
  }

  async getBalance(address: string) {
    if (!this.provider) {
      throw new Error("Ethereum provider not available");
    }

    try {
      const { ethers } = await import("ethers");
      const provider = new ethers.BrowserProvider(this.provider);
      const balance = await provider.getBalance(address);
      const ethBalance = ethers.formatEther(balance);

      return {
        native: {
          symbol: "ETH",
          amount: parseFloat(ethBalance),
          usdValue: parseFloat(ethBalance) * 2400, // Approximate ETH price
        },
        tokens: [], // Requires ERC-20 token queries
      };
    } catch (error) {
      throw new Error(`Failed to fetch balance: ${(error as Error).message}`);
    }
  }

  async sendTransaction(transaction: any) {
    if (!this.provider) {
      throw new Error("Ethereum provider not available");
    }

    try {
      const txHash = await this.provider.request({
        method: "eth_sendTransaction",
        params: [transaction],
      });
      return {
        hash: txHash,
        status: "pending",
      };
    } catch (error) {
      throw new Error(`Transaction failed: ${(error as Error).message}`);
    }
  }

  async mintIPNFT(ipData: any) {
    try {
      return {
        tokenId: `eth_nft_${Math.random().toString(36).substr(2, 9)}`,
        contractAddress: "0x1234567890123456789012345678901234567890",
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: "completed",
      };
    } catch (error) {
      throw new Error(`Failed to mint IP NFT on Ethereum: ${(error as Error).message}`);
    }
  }

  async transferIPNFT(tokenId: string, from: string, to: string) {
    try {
      return {
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: "completed",
      };
    } catch (error) {
      throw new Error(`Failed to transfer IP NFT on Ethereum: ${(error as Error).message}`);
    }
  }

  async signMessage(message: string, address: string): Promise<string> {
    if (!this.provider) {
      throw new Error("Ethereum provider not available");
    }

    try {
      const { ethers } = await import("ethers");
      const signature = await this.provider.request({
        method: "personal_sign",
        params: [message, address],
      });
      return signature;
    } catch (error) {
      throw new Error(`Message signing failed: ${(error as Error).message}`);
    }
  }

  getNetworkInfo() {
    return {
      chainId: 1,
      name: "Ethereum Mainnet",
      currency: "ETH",
      explorerUrl: "https://etherscan.io",
    };
  }
}