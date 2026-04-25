import React from 'react';
import { Phone, Video, Info, ArrowLeft } from 'lucide-react';
import styles from './ChatHeader.module.css'; // Import CSS module

interface ChatHeaderProps {
  avatarSrc: string;
  contactName: string;
  status: string; // e.g., "Active now", "Last seen 5m ago"
  onInfoClick: () => void; // New prop for info icon click
  nickname: string | null; // New prop for nickname
  chatEmoji: string | null; // New prop for chat-specific emoji
  onBackClick: () => void; // New prop for back button click
  isMobileView: boolean; // New prop to indicate if it's a mobile view
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ avatarSrc, contactName, status, onInfoClick, nickname, chatEmoji, onBackClick, isMobileView }) => {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.contactInfo}>
        {isMobileView && (
          <ArrowLeft className={styles.backButton} onClick={onBackClick} />
        )}
        {/* Contact Avatar */}
        <img src={avatarSrc} alt={contactName} className={styles.avatar} />
        <div className={styles.nameAndStatus}>
          <h3 className={styles.contactName}>
            {nickname || contactName} {chatEmoji && <span className={styles.chatEmoji}>{chatEmoji}</span>}
          </h3>
          <p className={styles.status}>{status}</p>
        </div>
      </div>
      <div className={styles.actionIcons}>
        {/* Voice Call Icon */}
        <Phone className={styles.icon} onClick={() => console.log('Phone icon clicked')} />
        {/* Video Call Icon */}
        <Video className={styles.icon} onClick={() => console.log('Video icon clicked')} />
        {/* Info Icon */}
        <Info className={styles.icon} onClick={onInfoClick} />
      </div>
    </div>
  );
};

export default ChatHeader;
