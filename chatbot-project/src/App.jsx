import { useState, useEffect } from 'react';
import { ChatInput } from './components/ChatInput'; // Named export. With Vite we can remove .js or .jsx extensions
import ChatMessages from './components/ChatMessages'; // default import without {}
// Vite supports importing any type of files (css, images, etc.).
import './App.css';
import { Chatbot } from 'supersimpledev';

function App() {
  const [chatMessages, setChatMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);
  
  useEffect(() => {Chatbot.addResponses({
    "What is your return policy?": "Our return policy allows returns within 30 days of purchase with a valid receipt.",
    "How can I track my order?": "You can track your order using the tracking link sent to your email after shipping.",
    "Do you offer international shipping?": "Yes, we offer international shipping to select countries. Please check our shipping policy for more details.",
    "What payment methods do you accept?": "We accept Visa, MasterCard, American Express, PayPal, and Apple Pay.",
    "How do I contact customer support?": "You can contact our customer support via email at support@example.com."
  })}, []);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

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
