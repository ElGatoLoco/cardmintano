import './Spinner.css';

import { FC } from 'react';

import logo from '../../assets/svg/cardano-logo.svg';

type Spinner = FC<{
  message?: string;
}>;
export const Spinner: Spinner = ({ message }) => {
  return (
    <div className="spinner-wrapper">
      <img src={logo} alt="Spinner" className="spinner" />
      {message && <p>{message}</p>}
    </div>
  );
};
