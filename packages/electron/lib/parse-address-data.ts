import { AddressData } from '../../../shared/types';

type ParseAddressData = (data: string) => Partial<AddressData>;
export const parseAddressData: ParseAddressData = (data) => {
  const parts = data.toString().split('\n')[2];
  if (!parts) {
    return {
      txHash: '',
      txIndex: '',
      balance: { lovelace: { amount: 0 } },
    };
  }
  const [txHash, txIndex, lovelace, _, ...restTokenData] = parts.split(/\s+/g);

  const balance = Object.assign(
    {},
    ...[
      { lovelace: { amount: parseInt(lovelace, 10) } },
      ...restTokenData
        .join()
        .split('+')
        .filter((x) => x !== '')
        .map((x) => x.split(',').filter((x) => x !== ''))
        .map(([amount, token]) => {
          const [policy, name] = token.split('.');

          return { [name]: { amount: parseInt(amount, 10), policy } };
        }),
    ],
  );

  return {
    txHash,
    txIndex,
    balance,
  };
};
