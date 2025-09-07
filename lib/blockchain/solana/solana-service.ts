// lib/blockchain/solana/solana-service.ts

export class SolanaService {
  private provider: any = null;
  private connection: any = null;

  constructor() {
    if (typeof window !== "undefined" && (window as any).solana?.isPhantom) {
      this.provider = (window as any).solana;
      // Initialize connection on client side only
      import("@solana/web3.js").then(({ Connection }) => {
        this.connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
      });
    }
  }

  async connect(): Promise<string> {
    if (!this.provider) {
      throw new Error("Solana wallet not installed");
    }

    try {
      const response = await this.provider.connect();
      
      if (!response || !response.publicKey) {
        throw new Error("Failed to get public key from wallet");
      }
      
      return response.publicKey.toString();
    } catch (error) {
      if ((error as any).code === 4001) {
        throw new Error("User rejected the connection request");
      }
      throw new Error(`Failed to connect to Solana wallet: ${(error as Error).message}`);
    }
  }

  async getBalance(address: string) {
    if (!this.connection) {
      throw new Error("Solana connection not initialized");
    }

    try {
      const { PublicKey } = await import("@solana/web3.js");
      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      const tokenAccounts = await this.connection.getTokenAccountsByOwner(publicKey, {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGK7t1x4W3Zf3uD4L9Z9f3e3Z"),
      });

      const tokens = tokenAccounts.value.map((account) => ({
        symbol: "UNKNOWN", // Requires token metadata
        amount: 0, // Requires parsing account data
        usdValue: 0, // Requires price feed
        mint: account.pubkey.toString(),
      }));

      return {
        native: {
          symbol: "SOL",
          amount: balance / 1e9, // Lamports to SOL
          usdValue: (balance / 1e9) * 100, // Approximate SOL price
        },
        tokens,
      };
    } catch (error) {
      throw new Error(`Failed to fetch Solana balance: ${(error as Error).message}`);
    }
  }

  async sendTransaction(transaction: Transaction) {
    if (!this.provider) {
      throw new Error("Solana provider not available");
    }

    try {
      const { signature } = await this.provider.signAndSendTransaction(transaction);
      if (!this.connection) {
        throw new Error("Solana connection not initialized");
      }
      const status = await this.connection.confirmTransaction(signature);
      return {
        signature,
        status: status.value.err ? "failed" : "confirmed",
      };
    } catch (error) {
      throw new Error(`Solana transaction failed: ${(error as Error).message}`);
    }
  }

  async mintIPNFT(ipData: any) {
    // Placeholder; requires Metaplex
    try {
      const { Transaction } = await import("@solana/web3.js");
      const signature = await this.provider.signAndSendTransaction(new Transaction());
      return {
        mint: `sol_nft_${Math.random().toString(36).substr(2, 9)}`,
        signature,
        status: "completed",
      };
    } catch (error) {
      throw new Error(`Failed to mint IP NFT on Solana: ${(error as Error).message}`);
    }
  }

  async transferIPNFT(mint: string, from: string, to: string) {
    // Placeholder; requires token program
    try {
      const { Transaction } = await import("@solana/web3.js");
      const signature = await this.provider.signAndSendTransaction(new Transaction());
      return {
        signature,
        status: "completed",
      };
    } catch (error) {
      throw new Error(`Failed to transfer IP NFT on Solana: ${(error as Error).message}`);
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider) {
      throw new Error("Solana provider not available");
    }

    try {
      const encodedMessage = new TextEncoder().encode(message);
      const { signature } = await this.provider.signMessage(encodedMessage, "utf8");
      return Buffer.from(signature).toString("hex");
    } catch (error) {
      throw new Error(`Message signing failed: ${(error as Error).message}`);
    }
  }

  getNetworkInfo() {
    return {
      cluster: "mainnet-beta",
      name: "Solana Mainnet",
      currency: "SOL",
      explorerUrl: "https://explorer.solana.com",
    };
  }
}