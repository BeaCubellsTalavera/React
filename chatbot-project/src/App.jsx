import { useState } from 'react';
import { ChatInput } from './components/ChatInput'; // Named export. With Vite we can remove .js or .jsx extensions
import ChatMessages from './components/ChatMessages'; // default import without {}
// Vite supports importing any type of files (css, images, etc.).
import './App.css';

function App() {
  const [chatMessages, setChatMessages] = useState([]);

        return (
          <div className="app-container">
            
            <ChatMessages
              chatMessages={chatMessages}
            />
            <ChatInput 
              chatMessages={chatMessages} 
              setChatMessages={setChatMessages}
            />
          </div>
        )
}

export default App
