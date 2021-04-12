import './ErrorMessage.css';

import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { FC, useEffect, useState } from 'react';

import { useElectron } from '../../shared/hooks/useElectron';

export const ErrorMessage: FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const { onMessage } = useElectron();

  useEffect(() => {
    onMessage('error', (_: unknown, error: Error) => {
      // eslint-disable-next-line no-console
      console.error('error: ', error);
      setMessage(error.message);
    });
  }, [onMessage]);

  return pipe(
    message,
    O.fromNullable,
    O.fold(
      () => null,
      () => (
        <div className="error-container">
          <p className="error-message">{message}</p>
        </div>
      ),
    ),
  );
};
