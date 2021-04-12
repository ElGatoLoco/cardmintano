import './FundAddress.css';

import { FC } from 'react';

import { useFundAddress } from './useFundAddress';

type FundAddress = FC<{
  address: string;
}>;
export const FundAddress: FundAddress = ({ address }) => {
  const { refreshAddress } = useFundAddress(address);

  return (
    <div className="fund-address-container">
      <h2>Fund Address</h2>
      <code className="address">{address}</code>
      <button onClick={refreshAddress} className="btn-primary width-300">
        Refresh
      </button>
    </div>
  );
};
