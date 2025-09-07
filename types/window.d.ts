interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    [key: string]: any; // For other properties of the ethereum object
  };
}