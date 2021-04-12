import { BrowserWindow } from 'electron';

type TokenInfo = { amount: number; policy?: string };
export type Balance = { lovelace: TokenInfo; [key: string]: TokenInfo };

export type AddressData = {
  address: string | null;
  balance: Balance | null;
  txHash: string | null;
  txIndex: string | null;
};
export type MintingData = {
  inProgress: boolean;
  tokenName: string;
  amount: number | null;
};

export type ClientMessage = 'get-address' | 'refresh-address' | 'mint-token';
export type ElectronMessage = 'address' | 'address-data' | 'error';

export type State = {
  tokenMintingData?: AddressData & MintingData;
  env: Partial<NodeJS.ProcessEnv>;
  window: BrowserWindow;
};
