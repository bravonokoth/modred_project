// src/lib/blockchain/hedera/hedera-service.ts
import { ChainService } from '../multi-chain';
import { HashConnect, SessionData } from 'hashconnect';
import {
  LedgerId,
  AccountId,
  TokenId,
  TransferTransaction,
  TokenAssociateTransaction,
  TokenCreateTransaction,
  TokenMintTransaction,
  Client,
  AccountBalanceQuery,
} from '@hashgraph/sdk';
import { MirrorNodeClient } from './mirrorNodeClient';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  description: string;
  amount: number;
  status: 'completed' | 'pending';
  timestamp: Date;
  unit?: string;
}

export class HederaService implements ChainService {
  private hashConnect: HashConnect | null = null;
  private isInitialized = false;
  private pairingData: SessionData | null = null;
  private mirrorNodeClient: MirrorNodeClient;
  private client: Client | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeHashConnect();
    }
    const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
    this.mirrorNodeClient = new MirrorNodeClient(network as 'testnet' | 'mainnet');
  }

  private async initializeHashConnect() {
    try {
      const appMetadata = {
        name: process.env.NEXT_PUBLIC_APP_NAME || 'Modred',
        description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Blockchain IP Management Platform',
        icons: [process.env.NEXT_PUBLIC_APP_ICON || '/favicon.ico'],
        url: process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
      };

      const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
      const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

      const ledgerId = LedgerId.fromString(network);
      this.hashConnect = new HashConnect(ledgerId, projectId, appMetadata, true);

      this.hashConnect.pairingEvent.on((newPairing) => {
        this.pairingData = newPairing;
        console.log('HashConnect paired:', newPairing);
        // Initialize Hedera client after pairing
        this.client = Client.forName(network);
        if (newPairing.accountIds[0]) {
          this.client.setOperator(newPairing.accountIds[0], newPairing.pairingData?.privateKey || '');
        }
      });

      this.hashConnect.disconnectionEvent.on(() => {
        this.pairingData = null;
        this.client = null;
        console.log('HashConnect disconnected');
      });

      await this.hashConnect.init();
      this.isInitialized = true;
      console.log('HashConnect initialized successfully');
    } catch (error) {
      console.error('Failed to initialize HashConnect:', error);
      throw new Error(`HashConnect initialization failed: ${(error as Error).message}`);
    }
  }

  async connect(): Promise<string> {
    if (!this.isInitialized || !this.hashConnect) {
      throw new Error('HashConnect not initialized');
    }

    await this.hashConnect.clearConnectionsAndData();
    await this.hashConnect.openPairingModal();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout - please try again'));
      }, 60000);

      this.hashConnect!.pairingEvent.once((pairingData) => {
        clearTimeout(timeout);
        if (pairingData.accountIds && pairingData.accountIds.length > 0) {
          const accountId = pairingData.accountIds[0];
          localStorage.setItem('hedera_account_id', accountId);
          localStorage.setItem('hedera_topic', pairingData.topic);
          localStorage.setItem('authToken', JSON.stringify({ address: accountId, chain: 'hedera' }));
          document.cookie = `auth-token=${accountId}; path=/; max-age=86400`;
          resolve(accountId);
        } else {
          reject(new Error('No account ID received from HashPack'));
        }
      });
    });
  }

  async disconnect(): Promise<void> {
    if (this.hashConnect) {
      await this.hashConnect.disconnect();
      this.pairingData = null;
      this.client = null;
      localStorage.removeItem('hedera_account_id');
      localStorage.removeItem('hedera_topic');
      localStorage.removeItem('signed_message');
      localStorage.removeItem('authToken');
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      console.log('HashPack disconnected successfully');
    }
  }

  async signMessage(message: string, accountId: string): Promise<string> {
    if (!this.hashConnect || !this.pairingData) {
      throw new Error('HashConnect not connected');
    }

    const result = await this.hashConnect.signMessage(this.pairingData.topic, accountId, message);
    return result.signature;
  }

  async getBalance(accountId: string): Promise<{
    native: { symbol: string; amount: number; usdValue: number };
    tokens: any[];
  }> {
    try {
      const client = Client.forName(process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet');
      const balance = await new AccountBalanceQuery()
        .setAccountId(AccountId.fromString(accountId))
        .execute(client);
      const tokenBalances = await this.mirrorNodeClient.getAccountTokenBalancesWithTokenInfo(accountId);

      const hbarAmount = balance.hbars.toBigNumber().toNumber() / 100_000_000; // Convert tinybars to HBAR
      // Fetch USD value from CoinGecko (or replace with your preferred price feed)
      let usdValue = hbarAmount * 0.05; // Placeholder
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd');
        const data = await response.json();
        usdValue = hbarAmount * data['hedera-hashgraph'].usd;
      } catch (priceError) {
        console.warn('Failed to fetch HBAR price:', priceError);
      }

      return {
        native: {
          symbol: 'HBAR',
          amount: hbarAmount,
          usdValue,
        },
        tokens: tokenBalances,
      };
    } catch (error) {
      console.error('Failed to fetch Hedera balance:', error);
      throw new Error(`Failed to fetch Hedera balance: ${(error as Error).message}`);
    }
  }

  async sendTransaction(transaction: any): Promise<{ transactionId?: string; hash?: string; status: string }> {
    if (!this.hashConnect || !this.pairingData || !this.client) {
      throw new Error('HashConnect or client not connected');
    }

    try {
      const tx = new TransferTransaction()
        .addHbarTransfer(AccountId.fromString(this.pairingData.accountIds[0]), transaction.amount.negative())
        .addHbarTransfer(AccountId.fromString(transaction.to), transaction.amount);

      const transactionBytes = await tx.toBytes();
      const result = await this.hashConnect.sendTransaction(this.pairingData.topic, {
        topic: this.pairingData.topic,
        byteArray: transactionBytes,
        metadata: {
          accountToSign: this.pairingData.accountIds[0],
        },
      });

      return {
        transactionId: result.transactionId,
        status: result.success ? 'completed' : 'failed',
      };
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw new Error(`Failed to send transaction: ${(error as Error).message}`);
    }
  }

  async mintIPNFT(ipData: any): Promise<{
    tokenId: string;
    transactionId?: string;
    transactionHash?: string;
    contractAddress?: string;
    status: string;
    metadata?: any;
  }> {
    if (!this.hashConnect || !this.pairingData || !this.client) {
      throw new Error('HashConnect or client not connected');
    }

    try {
      const tokenCreateTx = new TokenCreateTransaction()
        .setTokenName(ipData.name || 'IP NFT')
        .setTokenSymbol(ipData.symbol || 'IPNFT')
        .setTokenType('NON_FUNGIBLE_UNIQUE')
        .setTreasuryAccountId(AccountId.fromString(this.pairingData.accountIds[0]))
        .setSupplyKey(AccountId.fromString(this.pairingData.accountIds[0]));

      const tokenCreateBytes = await tokenCreateTx.toBytes();
      const tokenCreateResult = await this.hashConnect.sendTransaction(this.pairingData.topic, {
        topic: this.pairingData.topic,
        byteArray: tokenCreateBytes,
        metadata: {
          accountToSign: this.pairingData.accountIds[0],
        },
      });

      const tokenId = tokenCreateResult.receipt?.tokenId?.toString();
      if (!tokenId) {
        throw new Error('Failed to create NFT token');
      }

      const mintTx = new TokenMintTransaction()
        .setTokenId(TokenId.fromString(tokenId))
        .setMetadata([Buffer.from(JSON.stringify(ipData.metadata || {}))]);

      const mintBytes = await mintTx.toBytes();
      const mintResult = await this.hashConnect.sendTransaction(this.pairingData.topic, {
        topic: this.pairingData.topic,
        byteArray: mintBytes,
        metadata: {
          accountToSign: this.pairingData.accountIds[0],
        },
      });

      return {
        tokenId,
        transactionId: mintResult.transactionId,
        status: mintResult.success ? 'completed' : 'failed',
        metadata: ipData.metadata,
      };
    } catch (error) {
      console.error('Error minting IP NFT:', error);
      throw new Error(`Failed to mint IP NFT: ${(error as Error).message}`);
    }
  }

  async transferIPNFT(tokenId: string, from: string, to: string): Promise<{
    transactionId?: string;
    transactionHash?: string;
    status: string;
  }> {
    if (!this.hashConnect || !this.pairingData || !this.client) {
      throw new Error('HashConnect or client not connected');
    }

    try {
      const isAssociated = await this.mirrorNodeClient.isAssociated(to, tokenId);
      if (!isAssociated) {
        const associateTx = new TokenAssociateTransaction()
          .setAccountId(AccountId.fromString(to))
          .setTokenIds([TokenId.fromString(tokenId)]);

        const associateBytes = await associateTx.toBytes();
        await this.hashConnect.sendTransaction(this.pairingData.topic, {
          topic: this.pairingData.topic,
          byteArray: associateBytes,
          metadata: {
            accountToSign: this.pairingData.accountIds[0],
          },
        });
      }

      const transferTx = new TransferTransaction()
        .addNftTransfer(TokenId.fromString(tokenId), 1, AccountId.fromString(from), AccountId.fromString(to));

      const transferBytes = await transferTx.toBytes();
      const transferResult = await this.hashConnect.sendTransaction(this.pairingData.topic, {
        topic: this.pairingData.topic,
        byteArray: transferBytes,
        metadata: {
          accountToSign: this.pairingData.accountIds[0],
        },
      });

      return {
        transactionId: transferResult.transactionId,
        status: transferResult.success ? 'completed' : 'failed',
      };
    } catch (error) {
      console.error('Error transferring IP NFT:', error);
      throw new Error(`Failed to transfer IP NFT: ${(error as Error).message}`);
    }
  }

  async associateToken(tokenId: string, accountId: string): Promise<string> {
    if (!this.hashConnect || !this.pairingData) {
      throw new Error('HashConnect not connected');
    }

    const transaction = new TokenAssociateTransaction()
      .setAccountId(AccountId.fromString(accountId))
      .setTokenIds([TokenId.fromString(tokenId)]);

    const transactionBytes = await transaction.toBytes();
    const result = await this.hashConnect.sendTransaction(this.pairingData.topic, {
      topic: this.pairingData.topic,
      byteArray: transactionBytes,
      metadata: {
        accountToSign: accountId,
      },
    });

    return result.transactionId || `0.0.${Math.floor(Math.random() * 999999)}@${Date.now()}.${Math.floor(Math.random() * 999999999)}`;
  }

  async transferToken(tokenId: string, fromAccountId: string, toAccountId: string, amountOrSerial: number): Promise<string> {
    if (!this.hashConnect || !this.pairingData) {
      throw new Error('HashConnect not connected');
    }

    const isAssociated = await this.mirrorNodeClient.isAssociated(toAccountId, tokenId);
    if (!isAssociated) {
      throw new Error('Receiver account is not associated with the token');
    }

    const transaction = new TransferTransaction()
      .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(fromAccountId), -amountOrSerial)
      .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(toAccountId), amountOrSerial);

    const transactionBytes = await transaction.toBytes();
    const result = await this.hashConnect.sendTransaction(this.pairingData.topic, {
      topic: this.pairingData.topic,
      byteArray: transactionBytes,
      metadata: {
        accountToSign: fromAccountId,
      },
    });

    return result.transactionId || `0.0.${Math.floor(Math.random() * 999999)}@${Date.now()}.${Math.floor(Math.random() * 999999999)}`;
  }

  async getTransactionHistory(accountId: string): Promise<Transaction[]> {
    try {
      const response = await fetch(
        `${this.mirrorNodeClient.getUrl()}/api/v1/accounts/${accountId}/transactions?limit=10&order=desc`,
        { method: 'GET' }
      );
      const data = await response.json();
      return data.transactions.map((tx: any) => ({
        id: tx.transaction_id,
        type: tx.name === 'CRYPTOTRANSFER' && tx.transfers.some((t: any) => t.account === accountId && t.amount > 0)
          ? 'deposit'
          : 'withdrawal',
        description: tx.name === 'TOKENASSOCIATE' ? 'IP Asset Associated' : `Transfer ${tx.name}`,
        amount: tx.transfers?.find((t: any) => t.account === accountId)?.amount / 100_000_000 ||
                tx.token_transfers?.[0]?.amount || 0,
        status: tx.result === 'SUCCESS' ? 'completed' : 'pending',
        timestamp: new Date(tx.valid_start_timestamp * 1000),
        unit: tx.name === 'CRYPTOTRANSFER' ? 'HBAR' : tx.token_transfers?.[0]?.token_id || 'USD',
      }));
    } catch (error) {
      throw new Error(`Failed to fetch transaction history: ${(error as Error).message}`);
    }
  }

  getNetworkInfo() {
    const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';
    return {
      network,
      name: network === 'mainnet' ? 'Hedera Mainnet' : 'Hedera Testnet',
      currency: 'HBAR',
      explorerUrl: `https://hashscan.io/${network}`,
    };
  }

  isConnected(): boolean {
    return !!(this.pairingData && this.pairingData.accountIds.length > 0);
  }

  getAccountId(): string | null {
    return this.pairingData?.accountIds[0] || localStorage.getItem('hedera_account_id');
  }

  getUrl(): string {
    return this.mirrorNodeClient.getUrl();
  }
}