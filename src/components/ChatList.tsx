import { useContext } from 'react';
import { TokenContext } from '../services/TokenService';

const ChatList = ({
  chats,
  selectedChat,
  setSelectedChat
}: {
  chats: any;
  selectedChat: string | null;
  setSelectedChat: (chat: any) => void;
}) => {
  const { username } = useContext(TokenContext);

  return (
    <div className="chat-list">
      {chats.map((chat: any) => (
        <div
          className={`chat-card ${
            selectedChat === chat.id && 'chat-card--active'
          }`}
          key={chat.id}
          onClick={() => setSelectedChat(chat.id)}
        >
          <h4 className="chat-card__title">
            {
              chat.members.find((member: any) => member.username !== username)
                .username
            }
          </h4>
          <p className="chat-card__last-message">
            {chat.messages[chat.messages.length - 1]?.content}
          </p>
          <p className="chat-card__last-message-time">
            {chat.messages[0]?.createdAt
              ? new Date(chat.messages[0].createdAt).toLocaleString()
              : ''}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
