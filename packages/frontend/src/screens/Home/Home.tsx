import * as B from 'fp-ts/lib/boolean';
import { pipe } from 'fp-ts/lib/pipeable';
import { FC } from 'react';

import { Balance } from '../../../../../shared/types';
import { Spinner } from '../../components/Spinner/Spinner';
import { FundAddress } from './components/FundAddress/FundAddress';
import { Header } from './components/Header/Header';
import { MintTokenForm } from './components/MintTokenForm/MintTokenForm';
import { useHomeData } from './useHomeData';

export const Home: FC = () => {
  const { isLoading, addressData, isAddressWithNoFunds } = useHomeData();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Header balance={addressData.balance as Balance} />
      {pipe(
        isAddressWithNoFunds,
        B.fold(
          () => <MintTokenForm addressData={addressData} />,
          () => <FundAddress address={addressData.address as string} />,
        ),
      )}
    </>
  );
};
