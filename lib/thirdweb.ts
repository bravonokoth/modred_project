import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// Create thirdweb client
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

// Define supported chains
export const supportedChains = {
  ethereum: defineChain({
    id: 1,
    name: "Ethereum Mainnet",
    rpc: "https://ethereum.publicnode.com",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorers: [
      {
        name: "Etherscan",
        url: "https://etherscan.io",
      },
    ],
  }),
  sepolia: defineChain({
    id: 11155111,
    name: "Sepolia Testnet",
    rpc: "https://sepolia.infura.io/v3/",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorers: [
      {
        name: "Etherscan",
        url: "https://sepolia.etherscan.io",
      },
    ],
  }),
  polygon: defineChain({
    id: 137,
    name: "Polygon",
    rpc: "https://polygon-rpc.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorers: [
      {
        name: "PolygonScan",
        url: "https://polygonscan.com",
      },
    ],
  }),
  base: defineChain({
    id: 8453,
    name: "Base",
    rpc: "https://mainnet.base.org",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorers: [
      {
        name: "BaseScan",
        url: "https://basescan.org",
      },
    ],
  }),
};

export const defaultChain = supportedChains.ethereum;