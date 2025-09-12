declare module 'hashconnect' {
  class HashConnect {
    constructor(debug?: boolean);
    init(metadata?: any, network?: string, singleNetwork?: boolean): Promise<any>;
    disconnect(): Promise<void>;
    clearConnectionsAndData(): Promise<void>;
    connect(topic: string, accountId: string): Promise<any>;
    signMessage(topic: string, accountId: string, message: string): Promise<any>;
    sendTransaction(topic: string, transaction: any): Promise<any>;
    pairingEvent: {
      once(callback: (data: any) => void): void;
      on(callback: (data: any) => void): void;
    };
    disconnectionEvent: {
      on(callback: () => void): void;
    };
    hcData: {
      pairingData: any[];
    };
    openPairingModal(): Promise<void>;
  }

  export default HashConnect;
}
