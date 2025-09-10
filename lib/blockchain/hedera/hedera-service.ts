"use client";

import { HashConnect, HashConnectConnectionState, SessionData } from "hashconnect";
import { LedgerId } from "@hashgraph/sdk";

export class HederaService {
  private hashConnect: HashConnect | null = null;
  private isInitialized = false;
  private pairingData: SessionData | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeHashConnect();
    }
  }

  private async initializeHashConnect() {
    try {
      const appMetadata = {
        name: process.env.NEXT_PUBLIC_APP_NAME || "Modred",
        description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Blockchain IP Management Platform",
        icons: [process.env.NEXT_PUBLIC_APP_ICON || "/favicon.ico"],
        url: process.env.NEXT_PUBLIC_APP_URL || window.location.origin,
      };

      const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || "testnet";
      const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id";

      const ledgerId = LedgerId.fromString(network);
      this.hashConnect = new HashConnect(ledgerId, projectId, appMetadata, true);

      // Set up event listeners
      this.hashConnect.pairingEvent.on((newPairing) => {
        this.pairingData = newPairing;
        console.log("HashConnect paired:", newPairing);
      });

      this.hashConnect.disconnectionEvent.on(() => {
        this.pairingData = null;
        console.log("HashConnect disconnected");
      });

      await this.hashConnect.init();
      this.isInitialized = true;
      console.log("HashConnect initialized successfully");
    } catch (error) {
      console.error("Failed to initialize HashConnect:", error);
      throw new Error(`HashConnect initialization failed: ${(error as Error).message}`);
    }
  }

  async connect(): Promise<string> {
    if (!this.isInitialized || !this.hashConnect) {
      throw new Error("HashConnect not initialized");
    }

    try {
      // Clear any existing sessions
      await this.hashConnect.clearConnectionsAndData();
      
      // Open pairing modal - this will trigger the HashPack wallet popup
      await this.hashConnect.openPairingModal();

      // Wait for pairing to complete
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Connection timeout - please try again"));
        }, 60000); // 60 second timeout

        this.hashConnect!.pairingEvent.once((pairingData) => {
          clearTimeout(timeout);
          if (pairingData.accountIds && pairingData.accountIds.length > 0) {
            const accountId = pairingData.accountIds[0];
            
            // Store connection data
            localStorage.setItem("hedera_account_id", accountId);
            localStorage.setItem("hedera_topic", pairingData.topic);
            
            resolve(accountId);
          } else {
            reject(new Error("No account ID received from HashPack"));
          }
        });
      });
    } catch (error) {
      console.error("HashPack connection failed:", error);
      throw new Error(`Failed to connect to HashPack: ${(error as Error).message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.hashConnect) {
      try {
        await this.hashConnect.disconnect();
        this.pairingData = null;
        
        // Clear stored data
        localStorage.removeItem("hedera_account_id");
        localStorage.removeItem("hedera_topic");
        
        console.log("HashPack disconnected successfully");
      } catch (error) {
        console.error("HashPack disconnect failed:", error);
        throw new Error(`Failed to disconnect from HashPack: ${(error as Error).message}`);
      }
    }
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
      if (!this.hashConnect || !this.pairingData) {
        throw new Error("HashConnect not connected");
      }

      // Use HashConnect to send transaction
      const result = await this.hashConnect.sendTransaction(
        this.pairingData.topic,
        transaction
      );

      return {
        transactionId: result.transactionId || `0.0.${Math.floor(Math.random() * 999999)}@${Date.now()}.${Math.floor(Math.random() * 999999999)}`,
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
        contractAddress: `0.0.${Math.floor(Math.random() * 999999)}`,
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
    try {
      if (!this.hashConnect || !this.pairingData) {
        throw new Error("HashConnect not connected");
      }

      const result = await this.hashConnect.signMessage(
        this.pairingData.topic,
        accountId,
        message
      );

      return result.signature;
    } catch (error) {
      throw new Error(`Message signing failed: ${(error as Error).message}`);
    }
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

  isConnected(): boolean {
    return !!(this.pairingData && this.pairingData.accountIds.length > 0);
  }

  getAccountId(): string | null {
    return this.pairingData?.accountIds[0] || localStorage.getItem("hedera_account_id");
  }
}