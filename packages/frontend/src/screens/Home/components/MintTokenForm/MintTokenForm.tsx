import './MintTokenForm.css';

import * as B from 'fp-ts/lib/boolean';
import { pipe } from 'fp-ts/lib/pipeable';
import { FC } from 'react';

import { AddressData } from '../../../../../../../shared/types';
import { Spinner } from '../../../../components/Spinner/Spinner';
import { useTokenMint } from './useTokenMint';

type MintTokenForm = FC<{
  addressData: AddressData;
}>;
export const MintTokenForm: MintTokenForm = ({ addressData }) => {
  const {
    mintingData,
    onTokenNameChange,
    onTokenAmountChange,
    submitMintTokenForm,
  } = useTokenMint({ addressData });

  return pipe(
    mintingData.inProgress,
    B.fold(
      () => (
        <form className="mint-token-form" onSubmit={submitMintTokenForm}>
          <h1>Mint new token</h1>
          <input
            placeholder="Token name"
            value={mintingData.tokenName}
            onChange={onTokenNameChange}
            className="input-field width-300"
            required={true}
            pattern="[A-Za-z]+"
          />
          <input
            type="number"
            step="1"
            min="1"
            placeholder="Amount"
            value={mintingData.amount || ''}
            onChange={onTokenAmountChange}
            className="input-field width-300"
            required={true}
          />
          <button type="submit" className="btn-primary width-300 font-20">
            Mint!
          </button>
        </form>
      ),
      () => <Spinner message="Minting In Progress" />,
    ),
  );
};
