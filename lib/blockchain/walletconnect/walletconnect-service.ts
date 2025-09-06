// lib/blockchain/walletconnect/walletconnect-service.ts
"use client";

import { WalletKit } from "@reown/walletkit";

export class WalletConnectService {
  private walletKit: WalletKit | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      const appMetadata = {
        name: process.env.NEXT_PUBLIC_APP_NAME || "Modred",
        description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Modred dApp",
        url: process.env.NEXT_PUBLIC_APP_URL || window.location.origin,
        icons: [process.env.NEXT_PUBLIC_APP_ICON || "/favicon.ico"],
      };

      console.log("WalletConnect projectId:", process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID);

      this.walletKit = new WalletKit({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
        metadata: appMetadata,
      });
    }
  }

  async connect(): Promise<string> {
    if (!this.walletKit) throw new Error("WalletKit not initialized");
    try {
      await this.walletKit.connect();
      const sessions = this.walletKit.getActiveSessions();
      const session = Object.values(sessions)[0];
      if (!session) throw new Error("No active session");
      return session.namespaces.eip155?.accounts[0]?.split(":")[2];
    } catch (error) {
      throw new Error(`Failed to connect to WalletConnect: ${(error as Error).message}`);
    }
  }

  async getBalance(address: string) {
    try {
      return {
        native: {
          symbol: "ETH",
          amount: 0,
          usdValue: 0,
        },
        tokens: [],
      };
    } catch (error) {
      throw new Error(`Failed to fetch balance: ${(error as Error).message}`);
    }
  }

  async sendTransaction(transaction: any) {
    if (!this.walletKit) throw new Error("WalletKit not initialized");
    try {
      const result = await this.walletKit.request({
        chainId: "eip155:1",
        request: {
          method: "eth_sendTransaction",
          params: [transaction],
        },
      });
      return {
        hash: result,
        status: "pending",
      };
    } catch (error) {
      throw new Error(`Transaction failed: ${(error as Error).message}`);
    }
  }

  async mintIPNFT(ipData: any) {
    return {
      tokenId: `wc_nft_${Math.random().toString(36).substr(2, 9)}`,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      status: "completed",
    };
  }

  async transferIPNFT(tokenId: string, from: string, to: string) {
    return {
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      status: "completed",
    };
  }

  async signMessage(message: string, address: string): Promise<string> {
    if (!this.walletKit) throw new Error("WalletKit not initialized");
    try {
      const signature = await this.walletKit.request({
        chainId: "eip155:1",
        request: {
          method: "personal_sign",
          params: [message, address],
        },
      });
      return signature;
    } catch (error) {
      throw new Error(`Message signing failed: ${(error as Error).message}`);
    }
  }

  getNetworkInfo() {
    return {
      chainId: "eip155:1",
      name: "Ethereum Mainnet",
      currency: "ETH",
      explorerUrl: "https://etherscan.io",
    };
  }
}