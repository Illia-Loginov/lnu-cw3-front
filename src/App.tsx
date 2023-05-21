import { useContext } from 'react';
import { TokenContext } from './services/TokenService';
import Auth from './components/Auth';
import Main from './components/Main';

const App = () => {
  const { refreshToken } = useContext(TokenContext);

  return <>{refreshToken.length ? <Main /> : <Auth />}</>;
};

export default App;
