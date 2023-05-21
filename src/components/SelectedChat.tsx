import { useState, useContext } from 'react';
import { TokenContext } from '../services/TokenService';

const SelectedChat = ({
  chat,
  sendMessage
}: {
  chat: any;
  sendMessage: (chat: string, message: string) => void;
}) => {
  const [message, setMessage] = useState('');
  const { username } = useContext(TokenContext);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    sendMessage(chat.id, message);

    setMessage('');
  };

  return (
    <section className="selected-chat">
      {chat && (
        <>
          <div className="chat">
            {chat.messages.map((message: any) => (
              <div
                className={`message ${
                  message?.senderUsername === username && 'message--right'
                }`}
                key={message.id}
              >
                <h4 className="message__sender">{message.senderUsername}</h4>
                <p className="message__content">{message.content}</p>
                <p className="message__time">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <form className="send-message">
            <input
              type="text"
              value={message}
              placeholder="message"
              onChange={(e) => setMessage(e.target.value)}
              className="input send-message__input"
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="input input--button"
            >
              Send
            </button>
          </form>
        </>
      )}
    </section>
  );
};

export default SelectedChat;
