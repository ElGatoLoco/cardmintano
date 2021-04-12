import fs from 'fs';

import { Balance } from '../../../shared/types';

type CreateTxOutStringArgs = {
  appDataDir: string;
  address: string;
  lovelaceAmount?: number;
  balance: Balance;
  tokenName: string;
  amount: number;
};
type CreateTxOutString = (data: CreateTxOutStringArgs) => string;
export const createTxOutString: CreateTxOutString = ({
  appDataDir,
  address,
  lovelaceAmount,
  balance,
  tokenName,
  amount,
}) => {
  const policyId = fs.readFileSync(`${appDataDir}/data/policy/policyId`).toString().trim();
  const restTokensString = Object.entries(balance).reduce((acc, [name, { amount, policy }]) => {
    if (name === 'lovelace') {
      return acc;
    }

    return acc + ` + ${amount} ${policy}.${name}`;
  }, '');

  return `${address.trim()} + ${
    lovelaceAmount || balance.lovelace.amount
  }${restTokensString} + ${amount} ${policyId}.${tokenName}`;
};
