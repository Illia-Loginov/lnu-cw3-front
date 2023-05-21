import { useState } from 'react';

const NewChat = ({
  newChat,
  connected
}: {
  newChat: (withUsername: string) => void;
  connected: boolean;
}) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    newChat(username);

    setUsername('');
  };

  return (
    <form className="new-chat">
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input"
      />

      <button onClick={handleSubmit} className="input input--button">
        New chat{connected ? '' : ' (not connected)'}
      </button>
    </form>
  );
};

export default NewChat;
