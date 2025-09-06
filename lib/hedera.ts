import { Client, AccountId } from "@hashgraph/sdk"

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
  const config = HEDERA_NETWORK[network]

  if (network === "testnet") {
    return Client.forTestnet()
  } else {
    return Client.forMainnet()
  }
}

// Hedera account utilities
export function isValidHederaAccountId(accountId: string): boolean {
  try {
    AccountId.fromString(accountId)
    return true
  } catch {
    return false
  }
}

export function formatHederaAccountId(accountId: string): string {
  try {
    return AccountId.fromString(accountId).toString()
  } catch {
    return accountId
  }
}
