import * as STE from 'fp-ts-contrib/StateTaskEither';
import { pipe } from 'fp-ts/lib/pipeable';

import { State } from '../../../shared/types';
import { safeExec } from '../util/safe-exec';
import { createTxOutString } from './create-tx-out-string';
import { parseFeeData } from './parse-fee-data';

export const mintToken = pipe(
  safeExec('calc-fee.sh'),
  STE.chain((fee) =>
    STE.modify((state: State) => {
      const { txFee, remainingLovelace } = parseFeeData(state.tokenMintingData.balance)(fee);

      return {
        ...state,
        env: {
          ...state.env,
          TX_FEE: txFee.toString(),
          TX_OUT_STRING: createTxOutString({
            ...state.tokenMintingData,
            appDataDir: state.env.APP_DATA_DIR,
            lovelaceAmount: remainingLovelace,
          }),
        },
      };
    }),
  ),
  STE.chain(() => safeExec('mint.sh')),
);
