import { useCallback } from 'react';

import { useElectron } from '../../../../shared/hooks/useElectron';

type UseFundAddress = (
  address: string,
) => {
  refreshAddress: () => void;
};
export const useFundAddress: UseFundAddress = (address) => {
  const { sendMessage } = useElectron();

  const refreshAddress = useCallback(() => {
    sendMessage('refresh-address', address);
  }, [address, sendMessage]);

  return {
    refreshAddress,
  };
};
