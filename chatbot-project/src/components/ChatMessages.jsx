import { ChatMessage } from './ChatMessage';
import { useAutoScroll } from '../hooks/useAutoScroll';
import './ChatMessages.css';

function ChatMessages({ chatMessages }) {
  const chatMessagesRef = useAutoScroll([chatMessages]); // we use the custom hook to get the reference to the div element
  
  return (
    <div className="chat-messages-container" ref={chatMessagesRef}> {/* we assign the reference to the div element with ref */}
      {chatMessages.length === 0 
        ? <div className="welcome-message">Welcome to the Chatbot project! Send a message using the textbox below.</div>
        : chatMessages.map(({ message, sender, id }) => {
          return (
            <ChatMessage 
              message={message} 
              sender={sender}
              key={id}
            />
          );
        })
      }
    </div>
  );
}

export default ChatMessages; // default export useful if we want to export one thing from the file