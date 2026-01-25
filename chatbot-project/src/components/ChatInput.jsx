import { useState } from 'react'
import { Chatbot } from 'supersimpledev'
import './ChatInput.css'

export function ChatInput({ chatMessages, setChatMessages }) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  function saveInputValue(event) {
    setInputText(event.target.value);
  }

  async function sendMessage() { // state is updated after all of the code is finished
    if (isLoading || inputText === '') {
      return;
    }

    // Set isLoading to true at the start, and set it to
    // false after everything is done.
    setIsLoading(true);

    setInputText('');

    const newChatMessages = [
      ...chatMessages,
      {
        message: inputText,
        sender: "user",
        id: crypto.randomUUID() // Generate a unique identifier
      }
    ]

    setChatMessages([
      ...newChatMessages,
      // This creates a temporary Loading... message.
      // Because we don't save this message in newChatMessages,
      // it will be remove later, when we add the response.
      {
        message: <img src="https://supersimple.dev/images/loading-spinner.gif" alt="loading" className="loading-spinner" />,
        sender: 'robot',
        id: crypto.randomUUID()
      }
    ]);

    const response = await Chatbot.getResponseAsync(inputText);

    setChatMessages([
      ...newChatMessages,
      {
        message: response,
        sender: "robot",
        id: crypto.randomUUID()
      }
    ]);

    // Set isLoading to false after everything is done.
    setIsLoading(false);
  }

  function sendMessageOnEnter(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }

    if (event.key === 'Escape') {
      setInputText('');
    }
  }

  return (
    <div className="chat-input-container">
      <input 
        type="text" 
        placeholder="Send a message to Chatbot" 
        size="30"
        onChange={saveInputValue}
        onKeyDown={sendMessageOnEnter}
        value={inputText}
        className="chat-input"
      />
      <button
        onClick={sendMessage}
        disabled={inputText.length === 0 || isLoading}
        className="send-button"
      >Send</button>
    </div>
  );
}