import { useCallback, useEffect, useState } from 'react';

import { AddressData, MintingData } from '../../../../../../../shared/types';
import { useElectron } from '../../../../shared/hooks/useElectron';

type R = {
  mintingData: MintingData;
  onTokenNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTokenAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitMintTokenForm: (e: React.FormEvent) => void;
};
type UseTokenMint = (args: { addressData: AddressData }) => R;
export const useTokenMint: UseTokenMint = ({ addressData }) => {
  const { sendMessage, onMessage } = useElectron();
  const [mintingData, setMintingData] = useState<MintingData>({
    inProgress: false,
    tokenName: '',
    amount: null,
  });

  useEffect(() => {
    onMessage('address-data', () => {
      setMintingData((mintingData) => ({
        ...mintingData,
        inProgress: false,
        tokenName: '',
        amount: null,
      }));
    });
  }, [onMessage]);

  const mintToken = useCallback(() => {
    setMintingData((mintingData) => ({ ...mintingData, inProgress: true }));
    sendMessage('mint-token', { ...mintingData, ...addressData });
  }, [addressData, mintingData, sendMessage]);

  const onTokenNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMintingData((mintingData) => ({ ...mintingData, tokenName: e.target.value }));
    },
    [setMintingData],
  );

  const onTokenAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMintingData((mintingData) => ({
        ...mintingData,
        amount: e.target.value.length > 0 ? parseInt(e.target.value, 10) : null,
      }));
    },
    [setMintingData],
  );

  const submitMintTokenForm = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      mintToken();
    },
    [mintToken],
  );

  return {
    mintingData,
    onTokenNameChange,
    onTokenAmountChange,
    submitMintTokenForm,
  };
};
