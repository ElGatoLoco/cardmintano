import { Balance } from '../../../shared/types';

type R = {
  txFee: number;
  remainingLovelace: number;
};
type ParseFeeData = (balance: Balance) => (feeData: string) => R;
export const parseFeeData: ParseFeeData = (balance) => (feeData) => {
  const txFee = parseInt(feeData.toString().match(/\d+/g)[0], 10);
  const remainingLovelace = balance.lovelace.amount - txFee;

  return {
    txFee,
    remainingLovelace,
  };
};
