import { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../services/TokenService';
import { serverConfig } from '../config';
import NewChat from './NewChat';
import ChatList from './ChatList';
import SelectedChat from './SelectedChat';

const Main = () => {
  const { username, refreshAccessToken, logout, httpRequest, getSocket } =
    useContext(TokenContext);
  const [chats, setChats] = useState<any>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const socket = getSocket();
  socket.connect();

  const getChats = async () => {
    const { data: newChats = [] } =
      (await httpRequest('get', `${serverConfig.managerUrl}/chats/`)) || {};
    setChats(newChats);
  };

  const onConnectError = async (
    error: Error & { data?: { status?: number } }
  ) => {
    if (error.data?.status === 401) {
      socket.auth = { token: await refreshAccessToken() };
      socket.connect();
    } else {
      console.error();
    }
  };

  const onConnect = () => {
    setConnected(true);
  };

  const onNewChat = (newChat: any) => {
    setChats([...chats, newChat]);
  };

  const onNewMessage = (message: any) => {
    const newChats = chats.map((chat: any) => {
      if (chat.id === message.chatId) {
        delete message.chatId;
        chat.messages.push(message);
      }

      return chat;
    });

    console.log(newChats, chats.length);

    setChats(newChats);
  };

  const onError = (error: string) => {
    setErrorMessage(error);
  };

  useEffect(() => {
    getChats();

    socket.on('connect_error', onConnectError);
    socket.on('connect', onConnect);
    socket.on('error', onError);

    return () => {
      socket.off('connect_error', onConnectError);
      socket.off('connect', onConnect);
      socket.off('error', onError);
    };
  }, []);

  useEffect(() => {
    socket.on('newChat', onNewChat);
    socket.on('message', onNewMessage);

    return () => {
      socket.off('newChat', onNewChat);
      socket.off('message', onNewMessage);
    };
  }, [chats]);

  const newChat = (withUsername: string) => {
    socket.emit('createChat', { withUsername });
  };

  const newMessage = (chat: string, message: string) => {
    socket.emit('message', { content: message, chatId: chat });
  };

  const selectedChatName = () => {
    const { members } =
      chats.find((chat: any) => chat.id === selectedChat) || {};
    const name = members?.find(
      (member: any) => member.username !== username
    )?.username;

    return name ? ` with ${name}` : '';
  };

  return (
    <main className="main">
      <header className="header">
        <h2 className="header__heading">
          {username}
          {selectedChatName()}
        </h2>
        {errorMessage.length > 0 && <p className="error">{errorMessage}</p>}
      </header>
      <div className="sections">
        <section className="menu">
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
          <NewChat newChat={newChat} connected={connected} />
          <button
            onClick={() => logout()}
            className="input input--button logout"
          >
            Log out
          </button>
        </section>
        <SelectedChat
          chat={chats.find((chat: any) => chat.id === selectedChat)}
          sendMessage={newMessage}
        />
      </div>
    </main>
  );
};

export default Main;
