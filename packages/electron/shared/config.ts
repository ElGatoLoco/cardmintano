import path from 'path';

const DAEDALUS_NODE_SOCKET_PATH =
  '/Library/Application Support/Daedalus Testnet/cardano-node.socket';

export const baseEnv = {
  ...process.env,
  CARDANO_NODE_SOCKET_PATH: path.join(process.env.HOME, DAEDALUS_NODE_SOCKET_PATH),
  TESTNET_ID: '1097911063',
  APP_DATA_DIR: path.join(process.env.HOME, 'Library/Application Support/Cardmintano'),
};

export const FRONTEND_DEV_CLIENT_URL = 'http://localhost:3000';
