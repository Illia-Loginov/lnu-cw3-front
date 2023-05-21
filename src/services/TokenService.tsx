import axios, { AxiosResponse } from 'axios';
import { createContext, useState, ReactNode } from 'react';
import { serverConfig } from '../config';
import io, { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

interface ITokenContext {
  refreshToken: string;
  username: string;
  refreshAccessToken: () => Promise<string | undefined>;
  signup: (data: { username: string; password: string }) => void;
  login: (data: { username: string; password: string }) => void;
  logout: () => void;
  httpRequest: (
    method: 'get' | 'post' | 'delete',
    url: string,
    data?: any
  ) => Promise<AxiosResponse<any, any> | undefined>;
  getSocket: () => Socket;
}

const TokenContext = createContext<ITokenContext>({} as ITokenContext);

const TokenService = ({ children }: { children: ReactNode }) => {
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem('refreshToken') || ''
  );
  let accessToken = localStorage.getItem('accessToken') || '';
  let username = localStorage.getItem('username') || '';

  const setTokens = (
    newRefreshToken: string,
    newAccessToken: string,
    newUsername: string
  ) => {
    setRefreshToken(newRefreshToken);
    accessToken = newAccessToken;

    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('username', newUsername);
  };

  const signup = async (data: { username: string; password: string }) => {
    const {
      refreshToken: newRefreshToken,
      accessToken: newAccessToken,
      username: newUsername
    } = (
      await axios.post<{
        refreshToken: string;
        accessToken: string;
        username: string;
      }>(`${serverConfig.authUrl}/auth/signup`, data)
    ).data;

    setTokens(newRefreshToken, newAccessToken, newUsername);
  };

  const login = async (data: { username: string; password: string }) => {
    const {
      refreshToken: newRefreshToken,
      accessToken: newAccessToken,
      username: newUsername
    } = (
      await axios.post<{
        refreshToken: string;
        accessToken: string;
        username: string;
      }>(`${serverConfig.authUrl}/auth/login`, data)
    ).data;

    setTokens(newRefreshToken, newAccessToken, newUsername);
  };

  const logout = async () => {
    await axios.post(`${serverConfig.authUrl}/auth/logout`, { refreshToken });

    setTokens('', '', '');
  };

  const getHttpOptions = () => {
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
  };

  const refreshAccessToken = async () => {
    try {
      const { accessToken: newAccessToken, username: newUsername } = (
        await axios.post<{ accessToken: string; username: string }>(
          `${serverConfig.authUrl}/auth/refresh`,
          { refreshToken }
        )
      ).data;

      setTokens(refreshToken, newAccessToken, newUsername);

      return newAccessToken;
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 401) {
        setTokens('', '', '');
        return '';
      } else {
        console.error(error);
      }
    }
  };

  const httpRequest = async (
    method: 'get' | 'post' | 'delete',
    url: string,
    data = undefined
  ) => {
    try {
      if (method === 'get') {
        return await axios[method](url, getHttpOptions());
      } else {
        return await axios[method](url, data, getHttpOptions());
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.status === 401) {
        await refreshAccessToken();

        if (method === 'get') {
          return await axios[method](url, getHttpOptions());
        } else {
          return await axios[method](url, data, getHttpOptions());
        }
      } else {
        console.error(error);
      }
    }
  };

  const getSocketConnectionOptions = (): Partial<
    ManagerOptions & SocketOptions
  > => ({
    transports: ['websocket'],
    autoConnect: false,
    auth: { token: accessToken }
  });

  const getSocket = () => {
    return io(serverConfig.managerUrl, getSocketConnectionOptions());
  };

  return (
    <TokenContext.Provider
      value={{
        refreshToken,
        username,
        refreshAccessToken,
        signup,
        login,
        logout,
        httpRequest,
        getSocket
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export { TokenContext, TokenService };
