
// Hedera network configuration
export const HEDERA_NETWORK = {
  testnet: {
    name: "Hedera Testnet",
    nodeAccountId: "0.0.3",
    mirrorNodeUrl: "https://testnet.mirrornode.hedera.com",
    jsonRpcUrl: "https://testnet.hashio.io/api",
  },
  mainnet: {
    name: "Hedera Mainnet",
    nodeAccountId: "0.0.3",
    mirrorNodeUrl: "https://mainnet-public.mirrornode.hedera.com",
    jsonRpcUrl: "https://mainnet.hashio.io/api",
  },
}

// Create Hedera client
export function createHederaClient(network: "testnet" | "mainnet" = "testnet") {
  // Return mock client for demo
  return {
    network,
    config: HEDERA_NETWORK[network]
  };
}

// Hedera account utilities
export function isValidHederaAccountId(accountId: string): boolean {
  try {
    // Simple validation for demo
    return /^0\.0\.\d+$/.test(accountId);
  } catch {
    return false
  }
}

export function formatHederaAccountId(accountId: string): string {
  try {
    return accountId;
  } catch {
    return accountId
  }
}
