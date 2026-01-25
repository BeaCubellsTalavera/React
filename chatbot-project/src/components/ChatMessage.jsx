// Vite supports importing any type of files (css, images, etc.).
import RobotProfileImage from '../assets/robot.png'; // Default export
import UserProfileImage from '../assets/user.png';
import './ChatMessage.css';

export function ChatMessage({ message, sender }) {
  return (
    <div className={
      sender === 'user' 
        ? 'chat-message-user' 
        : 'chat-message-robot'
    }>
      {sender === 'robot' && (
        <img src={RobotProfileImage} alt="robot image" className="chat-message-profile"/>
      )}
      <div className="chat-message-text">
        {message}
      </div>
      {sender === 'user' && (
        <img src={UserProfileImage} alt="user image" className="chat-message-profile"/>
      )}
    </div>
  );
}