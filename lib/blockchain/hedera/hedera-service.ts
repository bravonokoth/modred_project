// lib/blockchain/hedera/hedera-service.ts
import { Client, AccountId, AccountBalanceQuery, TokenCreateTransaction, TokenType, TokenSupplyType, TransferTransaction } from "@hashgraph/sdk";
import { HEDERA_NETWORK, createHederaClient, isValidHederaAccountId } from "../../hedera";

export class HederaService {
  private client: Client | null = null;

  constructor() {
    this.client = createHederaClient(process.env.NEXT_PUBLIC_HEDERA_NETWORK as "testnet" | "mainnet");
  }

  async connect(): Promise<string> {
    // Connection handled by HederaWalletProvider
    throw new Error("Use HederaWalletProvider for connection");
  }

  async getBalance(accountId: string) {
    if (!this.client) {
      throw new Error("Hedera client not initialized");
    }

    try {
      const balance = await new AccountBalanceQuery()
        .setAccountId(AccountId.fromString(accountId))
        .execute(this.client);

      return {
        native: {
          symbol: "HBAR",
          amount: balance.hbars.toBigNumber().toNumber() / Math.pow(10, 8),
          usdValue: (balance.hbars.toBigNumber().toNumber() / Math.pow(10, 8)) * 0.07, // Approximate HBAR price
        },
        tokens: balance.tokens
          ? Object.entries(balance.tokens.toJSON()).map(([tokenId, amount]) => ({
              symbol: tokenId, // Requires token metadata query
              amount: Number(amount) / Math.pow(10, 8), // Adjust decimals
              usdValue: 0, // Requires price feed
              tokenId,
            }))
          : [],
      };
    } catch (error) {
      throw new Error(`Failed to fetch Hedera balance: ${(error as Error).message}`);
    }
  }

  async sendTransaction(transaction: any) {
    if (!this.client) {
      throw new Error("Hedera client not initialized");
    }

    try {
      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      return {
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
      };
    } catch (error) {
      throw new Error(`Hedera transaction failed: ${(error as Error).message}`);
    }
  }

  async mintIPNFT(ipData: any) {
    if (!this.client) {
      throw new Error("Hedera client not initialized");
    }

    try {
      const transaction = new TokenCreateTransaction()
        .setTokenName(ipData.title)
        .setTokenSymbol(ipData.title.substring(0, 4).toUpperCase())
        .setTokenType(TokenType.NonFungibleUnique)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(1)
        .setTreasuryAccountId(this.client.operatorAccountId!)
        .setAdminKey(this.client.operatorPublicKey!)
        .setSupplyKey(this.client.operatorPublicKey!);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      const tokenId = receipt.tokenId?.toString();

      return {
        tokenId,
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
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
    if (!this.client) {
      throw new Error("Hedera client not initialized");
    }

    try {
      const transaction = new TransferTransaction()
        .addNftTransfer(tokenId, 1, AccountId.fromString(from), AccountId.fromString(to));

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      return {
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
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
      name: HEDERA_NETWORK[network].name,
      currency: "HBAR",
      explorerUrl: `https://hashscan.io/${network}`,
    };
  }
}