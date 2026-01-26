import dayjs from 'dayjs';
// Vite supports importing any type of files (css, images, etc.).
import RobotProfileImage from '../assets/robot.png'; // Default export
import './ChatMessage.css';

export function ChatMessage({ message, sender, time }) {
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
        <div className='message-timestamp'>
          {
            dayjs(time).format('h:mma')
          }
        </div>
      </div>
      {sender === 'user' && (
        <img src="https://supersimple.dev/images/profile-1.jpg" alt="user image" className="chat-message-profile-user"/>
      )}
    </div>
  );
}