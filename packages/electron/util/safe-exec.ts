import { ExecException, exec } from 'child_process';
import path from 'path';

import * as STE from 'fp-ts-contrib/StateTaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/pipeable';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';

import { State } from '../../../shared/types';

const execTask: (
  path: string,
  options: { env: Partial<NodeJS.ProcessEnv> },
  callback?: (error: ExecException | null, stdout: string, stderr: string) => void,
) => TE.TaskEither<ExecException, string> = TE.taskify(exec);

type SafeExec = (scriptName: string) => STE.StateTaskEither<State, ExecException, string>;
export const safeExec: SafeExec = (scriptName) => (environment) => {
  const urlPath =
    environment.env.NODE_ENV === 'development'
      ? path.join(__dirname, '../../scripts')
      : path.join(process.resourcesPath, 'scripts');

  return pipe(
    execTask(`${urlPath}/${scriptName}`, { env: environment.env }),
    T.map(E.map((res) => [res, environment])),
  );
};
