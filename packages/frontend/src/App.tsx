import './App.css';

import { FC } from 'react';

import { ErrorMessage } from './components/Error/ErrorMessage';
import { Home } from './screens/Home/Home';

const App: FC = () => {
  return (
    <div className="App">
      <ErrorMessage />
      <Home />
    </div>
  );
};

export default App;
