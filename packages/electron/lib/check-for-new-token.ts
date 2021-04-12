import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { capDelay, exponentialBackoff, limitRetries, monoidRetryPolicy } from 'retry-ts';
import { retrying } from 'retry-ts/lib/Task';

import { Balance, State } from '../../../shared/types';
import { safeExec } from '../util/safe-exec';
import { parseAddressData } from './parse-address-data';

const DELAY_CAP = 10000;
const EXPONENTIAL_BACKOFF = 1000;
const RETRY_LIMIT = 20;

const policy = capDelay(
  DELAY_CAP,
  monoidRetryPolicy.concat(exponentialBackoff(EXPONENTIAL_BACKOFF), limitRetries(RETRY_LIMIT)),
);

type CheckForNewToken = (state: State, balance: Balance, name: string) => void;
export const checkForNewToken: CheckForNewToken = ({ env, window }, balance, name) => {
  retrying(
    policy,
    () => safeExec('query-address.sh')({ env, window }),
    (res) =>
      pipe(
        res,
        E.fold(
          () => true,
          ([txData]) => {
            const addressData = parseAddressData(txData);
            if (
              !addressData.balance[name] ||
              addressData.balance[name]?.amount <= balance[name]?.amount
            ) {
              return true;
            }

            window.webContents.send('address-data', addressData);

            return false;
          },
        ),
      ),
  )();
};
