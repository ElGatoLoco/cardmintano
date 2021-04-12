import * as STE from 'fp-ts-contrib/StateTaskEither';
import { pipe } from 'fp-ts/lib/pipeable';

import { State } from '../../../shared/types';
import { safeExec } from '../util/safe-exec';

export const getAddress = pipe(
  safeExec('get-or-create-address.sh'),
  STE.chain((address) =>
    pipe(
      STE.get<State>(),
      STE.map(({ window }) => window.webContents.send('address', address)),
    ),
  ),
  STE.chain(() => safeExec('query-address.sh')),
);
