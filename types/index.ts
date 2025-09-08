// types/index.ts
export interface IPAsset {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  owner: string;
  price: string;
  royaltyRate: string;
  tags: string[];
  image: string;
  licensesIssued: number;
  rating: number;
  verified: boolean;
}

export interface Transaction {
  id: string;
  hash: string;
  type: "send" | "receive" | "mint" | "transfer";
  status: "pending" | "completed" | "failed";
  chain: string;
  from: string;
  to: string;
  amount: string;
  currency: string;
  timestamp: Date;
  description?: string;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      [key: string]: any;
    };
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      signMessage: (message: Uint8Array, encoding: string) => Promise<{ signature: Uint8Array }>;
      signAndSendTransaction: (transaction: any) => Promise<{ signature: string }>;
      [key: string]: any;
    };
  }
}