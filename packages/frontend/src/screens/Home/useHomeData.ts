import { useEffect, useMemo, useState } from 'react';

import { AddressData } from '../../../../../shared/types';
import { useElectron } from '../../shared/hooks/useElectron';

type UseHomeData = () => {
  isLoading: boolean;
  addressData: AddressData;
  isAddressWithNoFunds: boolean;
};
export const useHomeData: UseHomeData = () => {
  const [addressData, setAddressData] = useState<AddressData>({
    address: null,
    balance: null,
    txHash: null,
    txIndex: null,
  });

  const isAddressWithNoFunds = useMemo(() => {
    return Boolean(addressData.address && addressData.balance?.lovelace.amount === 0);
  }, [addressData.address, addressData.balance?.lovelace.amount]);

  const isLoading = useMemo(() => !addressData.address || addressData.balance === null, [
    addressData.address,
    addressData.balance,
  ]);

  const { sendMessage, onMessage } = useElectron();

  useEffect(() => {
    sendMessage('get-address');
  }, [sendMessage]);

  useEffect(() => {
    onMessage('address', (_: unknown, address: string) => {
      setAddressData((prevData) => ({ ...prevData, address }));
    });
  }, [onMessage]);

  useEffect(() => {
    onMessage('address-data', (_: unknown, addressData: Partial<AddressData>) => {
      setAddressData((prevData) => ({ ...prevData, ...addressData }));
    });
  }, [onMessage]);

  return {
    isLoading,
    addressData,
    isAddressWithNoFunds,
  };
};
