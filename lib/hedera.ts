// Hedera network configuration
export const HEDERA_NETWORK = {
  testnet: {
    name: "Hedera Testnet",
    nodeAccountId: "0.0.3",
    mirrorNodeUrl: "https://testnet.mirrornode.hedera.com",
    jsonRpcUrl: "https://testnet.hashio.io/api",
    explorerUrl: "https://hashscan.io/testnet",
  },
  mainnet: {
    name: "Hedera Mainnet", 
    nodeAccountId: "0.0.3",
    mirrorNodeUrl: "https://mainnet-public.mirrornode.hedera.com",
    jsonRpcUrl: "https://mainnet.hashio.io/api",
    explorerUrl: "https://hashscan.io/mainnet",
  },
}

// Create Hedera client configuration
export function createHederaClient(network: "testnet" | "mainnet" = "testnet") {
  const config = HEDERA_NETWORK[network];
  
  return {
    network,
    config,
    // Mock client methods for demo
    getAccountBalance: async (accountId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        hbars: 1000 + Math.random() * 500,
        tokens: new Map(),
      };
    },
    executeTransaction: async (transaction: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        transactionId: `0.0.${Math.floor(Math.random() * 999999)}@${Date.now()}.${Math.floor(Math.random() * 999999999)}`,
        receipt: "SUCCESS",
      };
    },
  };
}

// Hedera account utilities
export function isValidHederaAccountId(accountId: string): boolean {
  try {
    return /^\d+\.\d+\.\d+$/.test(accountId);
  } catch {
    return false;
  }
}

export function formatHederaAccountId(accountId: string): string {
  try {
    // Hedera account IDs are already in the correct format
    return accountId;
  } catch {
    return accountId;
  }
}

// Hedera transaction utilities
export function createHederaTransactionId(): string {
  const timestamp = Date.now();
  const nanos = Math.floor(Math.random() * 999999999);
  const nodeAccountId = Math.floor(Math.random() * 999999);
  return `0.0.${nodeAccountId}@${timestamp}.${nanos}`;
}

// Hedera network detection
export function getHederaNetwork(): "testnet" | "mainnet" {
  return (process.env.NEXT_PUBLIC_HEDERA_NETWORK as "testnet" | "mainnet") || "testnet";
}

// Hedera explorer URL generator
export function getHederaExplorerUrl(accountId: string, type: "account" | "transaction" = "account"): string {
  const network = getHederaNetwork();
  const baseUrl = HEDERA_NETWORK[network].explorerUrl;
  return `${baseUrl}/${type}/${accountId}`;
}