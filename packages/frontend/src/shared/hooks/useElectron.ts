import { useCallback } from 'react';

import { ClientMessage, ElectronMessage } from '../../../../../shared/types';

const electron = window.require('electron');

type SendMessage = <T>(msgId: ClientMessage, payload?: T) => void;
type OnMessage = <T>(msgId: ElectronMessage, callback: (_: unknown, data: T) => void) => void;
type UseElectron = () => {
  sendMessage: SendMessage;
  onMessage: OnMessage;
};
export const useElectron: UseElectron = () => {
  const sendMessage: SendMessage = useCallback((msgId, payload) => {
    electron.ipcRenderer.send(msgId, payload);
  }, []);

  const onMessage: OnMessage = useCallback((msgId, cb) => {
    electron.ipcRenderer.on(msgId, cb);
  }, []);

  return {
    sendMessage,
    onMessage,
  };
};
