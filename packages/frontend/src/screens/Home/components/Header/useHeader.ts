import { useCallback, useMemo, useState } from 'react';

import { Balance, TokenInfo } from '../../../../../../../shared/types';

type UseHeader = (
  balance: Balance,
) => {
  adaBalance: string;
  isOtherTokensButtonShown: boolean;
  otherTokensButtonText: string;
  otherTokensList: [string, TokenInfo][];
  fullBalanceShown: boolean;
  showFullBalance: () => void;
  hideFullBalance: () => void;
};
export const useHeader: UseHeader = (balance) => {
  const [fullBalanceShown, setFullBalanceShown] = useState(false);
  const adaBalance = useMemo(() => {
    return (balance.lovelace.amount / 1000000).toFixed(6);
  }, [balance.lovelace.amount]);

  const numberOfTokens = useMemo(() => {
    return Object.keys(balance).length;
  }, [balance]);

  const isOtherTokensButtonShown = useMemo(() => {
    return numberOfTokens > 1 && !fullBalanceShown;
  }, [fullBalanceShown, numberOfTokens]);

  const otherTokensButtonText = useMemo(() => {
    if (numberOfTokens === 2) {
      return '+ 1 other token';
    }

    return `+ ${numberOfTokens - 1} other tokens`;
  }, [numberOfTokens]);

  const otherTokensList = useMemo(() => {
    const { lovelace: _, ...otherTokens } = balance;

    return Object.entries(otherTokens);
  }, [balance]);

  const showFullBalance = useCallback(() => {
    setFullBalanceShown(true);
  }, []);
  const hideFullBalance = useCallback(() => {
    setFullBalanceShown(false);
  }, []);

  return {
    adaBalance,
    isOtherTokensButtonShown,
    otherTokensButtonText,
    otherTokensList,
    fullBalanceShown,
    showFullBalance,
    hideFullBalance,
  };
};
