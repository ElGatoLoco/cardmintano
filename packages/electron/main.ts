import * as path from 'path';

import { BrowserWindow, app, ipcMain } from 'electron';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';

import { AddressData, MintingData } from '../../shared/types';
import { checkForNewToken } from './lib/check-for-new-token';
import { createTxOutString } from './lib/create-tx-out-string';
import { getAddress } from './lib/get-or-create-address';
import { mintToken } from './lib/mint-token';
import { parseAddressData } from './lib/parse-address-data';
import { FRONTEND_DEV_CLIENT_URL, baseEnv } from './shared/config';
import { notifyClient, sendErrorToClient } from './util/notify-client';
import { safeExec } from './util/safe-exec';

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules/.bin/electron'),
  });
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: process.env.NODE_ENV === 'development',
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../assets/icons/mac/1024x1024.icns'),
  });

  const startURL =
    process.env.NODE_ENV === 'development'
      ? FRONTEND_DEV_CLIENT_URL
      : `file://${path.join(__dirname, '../../frontend/index.html')}`;
  mainWindow.loadURL(startURL);

  ipcMain.on('get-address', () => {
    pipe(
      getAddress({ env: baseEnv, window: mainWindow }),
      T.map(
        E.fold(sendErrorToClient(mainWindow), ([txData]) =>
          notifyClient(mainWindow)('address-data')(parseAddressData(txData)),
        ),
      ),
    )();
  });

  ipcMain.on('refresh-address', () => {
    pipe(
      safeExec('query-address.sh')({ env: baseEnv, window: mainWindow }),
      T.map(
        E.fold(sendErrorToClient(mainWindow), ([txData]) =>
          notifyClient(mainWindow)('address-data')(parseAddressData(txData)),
        ),
      ),
    )();
  });

  ipcMain.on('mint-token', (_, tokenMintingData: MintingData & AddressData) => {
    pipe(
      mintToken({
        tokenMintingData,
        env: {
          ...baseEnv,
          TX_HASH: tokenMintingData.txHash,
          TX_IX: tokenMintingData.txIndex,
          TOKEN_NAME: tokenMintingData.tokenName,
          TOKEN_AMOUNT: tokenMintingData.amount.toString(),
          TX_OUT_STRING: createTxOutString({
            appDataDir: baseEnv.APP_DATA_DIR,
            address: tokenMintingData.address,
            balance: tokenMintingData.balance,
            tokenName: tokenMintingData.tokenName,
            amount: tokenMintingData.amount,
          }),
        },
        window: mainWindow,
      }),
      T.map(
        E.fold(sendErrorToClient(mainWindow), () =>
          checkForNewToken(
            { env: baseEnv, window: mainWindow },
            tokenMintingData.balance,
            tokenMintingData.tokenName,
          ),
        ),
      ),
    )();
  });
};

app.on('ready', () => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
