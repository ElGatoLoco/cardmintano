import { BrowserWindow } from 'electron';

type SendErrorToClient = (window: BrowserWindow) => (e: Error) => void;
export const sendErrorToClient: SendErrorToClient = (window) => (e) => {
  window.webContents.send('error', e);
};

type NotifyClient = (window: BrowserWindow) => (msgId: string) => <T>(message: T) => void;
export const notifyClient: NotifyClient = (window) => (msgId) => (message) => {
  window.webContents.send(msgId, message);
};
