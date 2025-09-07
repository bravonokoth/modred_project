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

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      [key: string]: any;
    };
  }
}