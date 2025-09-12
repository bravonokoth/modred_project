export interface MirrorNodeAccountTokenBalance {
  balance: number;
  token_id: string;
}

export interface MirrorNodeTokenInfo {
  type: 'FUNGIBLE_COMMON' | 'NON_FUNGIBLE_UNIQUE';
  decimals: string;
  name: string;
  symbol: string;
  token_id: string;
}

export interface MirrorNodeNftInfo {
  token_id: string;
  serial_number: number;
}

export interface MirrorNodeAccountTokenBalanceWithInfo extends MirrorNodeAccountTokenBalance {
  info: MirrorNodeTokenInfo;
  nftSerialNumbers?: number[];
}

export class MirrorNodeClient {
  private url: string;

  constructor(network: 'testnet' | 'mainnet') {
    this.url = network === 'mainnet'
      ? 'https://mainnet-public.mirrornode.hedera.com'
      : 'https://testnet.mirrornode.hedera.com';
  }

  getUrl(): string {
    return this.url;
  }

  async getAccountTokenBalances(accountId: string): Promise<MirrorNodeAccountTokenBalance[]> {
    const response = await fetch(`${this.url}/api/v1/accounts/${accountId}/tokens?limit=100`, { method: 'GET' });
    const data = await response.json();
    let tokenBalances = [...data.tokens] as MirrorNodeAccountTokenBalance[];

    let nextLink = data.links.next;
    while (nextLink !== null) {
      const nextResponse = await fetch(`${this.url}${nextLink}`, { method: 'GET' });
      const nextData = await nextResponse.json();
      tokenBalances.push(...nextData.tokens);
      nextLink = nextData.links.next;
    }

    return tokenBalances;
  }

  async getTokenInfo(tokenId: string): Promise<MirrorNodeTokenInfo> {
    const response = await fetch(`${this.url}/api/v1/tokens/${tokenId}`, { method: 'GET' });
    return await response.json() as MirrorNodeTokenInfo;
  }

  async getNftInfo(accountId: string): Promise<MirrorNodeNftInfo[]> {
    const response = await fetch(`${this.url}/api/v1/accounts/${accountId}/nfts?limit=100`, { method: 'GET' });
    const data = await response.json();
    let nftInfos = [...data.nfts] as MirrorNodeNftInfo[];

    let nextLink = data.links.next;
    while (nextLink !== null) {
      const nextResponse = await fetch(`${this.url}${nextLink}`, { method: 'GET' });
      const nextData = await nextResponse.json();
      nftInfos.push(...nextData.nfts);
      nextLink = nextData.links.next;
    }

    return nftInfos;
  }

  async getAccountTokenBalancesWithTokenInfo(accountId: string): Promise<MirrorNodeAccountTokenBalanceWithInfo[]> {
    const tokens = await this.getAccountTokenBalances(accountId);
    const tokenInfos = new Map<string, MirrorNodeTokenInfo>();
    for (const token of tokens) {
      const tokenInfo = await this.getTokenInfo(token.token_id);
      tokenInfos.set(tokenInfo.token_id, tokenInfo);
    }

    const nftInfos = await this.getNftInfo(accountId);
    const tokenIdToSerialNumbers = new Map<string, number[]>();
    for (const nftInfo of nftInfos) {
      const tokenId = nftInfo.token_id;
      const serialNumber = nftInfo.serial_number;
      if (!tokenIdToSerialNumbers.has(tokenId)) {
        tokenIdToSerialNumbers.set(tokenId, [serialNumber]);
      } else {
        tokenIdToSerialNumbers.get(tokenId)!.push(serialNumber);
      }
    }

    return tokens.map(token => ({
      ...token,
      info: tokenInfos.get(token.token_id)!,
      nftSerialNumbers: tokenIdToSerialNumbers.get(token.token_id),
    }));
  }

  async isAssociated(accountId: string, tokenId: string): Promise<boolean> {
    const tokenBalances = await this.getAccountTokenBalances(accountId);
    return tokenBalances.some(token => token.token_id === tokenId);
  }
}