import { useContext, useState } from 'react';
import { TokenContext } from '../services/TokenService';
import axios from 'axios';

const Auth = () => {
  const { signup, login } = useContext(TokenContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const signupHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      await signup({ username, password });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data.message);
      } else {
        console.error(error);
      }
    }
  };

  const loginHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      await login({ username, password });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data.message);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <form className="auth">
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />

      <button onClick={signupHandler} className="input input--button">
        Signup
      </button>
      <button onClick={loginHandler} className="input input--button">
        Login
      </button>

      {errorMessage.length > 0 && <p className="error">{errorMessage}</p>}
    </form>
  );
};

export default Auth;
