import './Header.css';

import { FC } from 'react';

import { Balance } from '../../../../../../../shared/types';
import logo from '../../../../assets/svg/cardano-logo.svg';
import { useHeader } from './useHeader';

type Header = FC<{
  balance: Balance;
}>;
export const Header: Header = ({ balance }) => {
  const {
    adaBalance,
    isOtherTokensButtonShown,
    otherTokensButtonText,
    otherTokensList,
    fullBalanceShown,
    showFullBalance,
    hideFullBalance,
  } = useHeader(balance);

  return (
    <header className="main-header-wrapper">
      <div className="main-header">
        <img src={logo} alt="Cardano Logo" className="header-logo" />
        <div className="balance">
          <span className="ada-balance">{adaBalance} ₳</span>
          <button
            className={`btn-primary ${isOtherTokensButtonShown ? 'shown' : 'hidden'}`}
            onClick={showFullBalance}
          >
            {otherTokensButtonText}
          </button>
        </div>
      </div>
      <div className={`other-tokens ${fullBalanceShown ? 'expanded' : ''}`}>
        <div className="other-tokens-list">
          {otherTokensList.map(([token, tokenInfo]) => {
            return (
              <p key={token}>
                {tokenInfo.amount} {token}
              </p>
            );
          })}
        </div>
        <button onClick={hideFullBalance} className="btn-primary width-full absolute-bottom">
          ⇪
        </button>
      </div>
    </header>
  );
};
