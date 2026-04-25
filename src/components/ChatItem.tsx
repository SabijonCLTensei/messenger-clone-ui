import React, { useRef } from 'react'; // Import useRef
import { formatDistanceToNowStrict } from 'date-fns';
import { X } from 'lucide-react'; // Import X for delete
import styles from './ChatItem.module.css'; // Import CSS module
import clsx from 'clsx'; // For conditional classes

interface ChatItemProps {
  chatId: string; // Add chatId to props
  avatarSrc: string;
  contactName: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount?: number;
  isOnline: boolean;
  isSelected: boolean; // New prop
  onClick: (chatId: string) => void; // New prop
  onEditAvatar: (chatId: string, newAvatarSrc: string) => void; // New prop for editing avatar
  onDeleteAvatar: (chatId: string) => void; // New prop for deleting avatar
}

const ChatItem: React.FC<ChatItemProps> = ({
  chatId,
  avatarSrc,
  contactName,
  lastMessage,
  timestamp,
  unreadCount,
  isOnline,
  isSelected,
  onClick,
  onEditAvatar,
  onDeleteAvatar,
}) => {
  const formattedTimestamp = formatDistanceToNowStrict(timestamp, { addSuffix: true });
  const avatarInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newAvatarSrc = URL.createObjectURL(file);
      onEditAvatar(chatId, newAvatarSrc);
      e.target.value = ''; // Clear the input to allow selecting the same file again
    }
  };

  const handleDeleteAvatar = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent chat item click
    onDeleteAvatar(chatId);
  };

  const isDefaultAvatar = avatarSrc.includes('via.placeholder.com'); // Simple check for default avatar

  return (
    <div
      className={clsx(styles.chatItem, isSelected && styles.chatItemIsSelected)}
      onClick={() => onClick(chatId)}
    >
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={avatarInputRef}
        style={{ display: 'none' }}
        onChange={handleAvatarChange}
      />

      {/* Avatar with Online Status */}
      <div className={clsx(styles.avatarWrapper, styles.avatarEditable)} onClick={() => avatarInputRef.current?.click()}>
        <img src={avatarSrc} alt={contactName} className={styles.avatar} />
        {isOnline && (
          <div className={styles.onlineDot}></div>
        )}
        {!isDefaultAvatar && (
          <button className={styles.deleteAvatarButton} onClick={handleDeleteAvatar} title="Remove Photo">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Chat Info */}
      <div className={styles.chatInfo}>
        <div className={styles.chatInfoRow1}>
          <h3 className={styles.contactName}>{contactName}</h3>
          <span className={styles.timestamp}>{formattedTimestamp}</span>
        </div>
        <div className={styles.chatInfoRow2}>
          <p className={styles.lastMessage}>{lastMessage}</p>
          {unreadCount !== undefined && unreadCount > 0 && (
            <div className={styles.unreadBadge}>
              {unreadCount}
            </div>
          )}
          {unreadCount === 0 && (
            <div className={styles.readDot}></div>
          )}
        </div>
      </div>

      {/* Right-click context menu placeholder - hidden by default */}
      <div className={styles.contextMenu}>
        <ul className={styles.contextMenuUl}>
          <li className={styles.contextMenuLi}>Mute</li>
          <li className={styles.contextMenuLi}>Archive</li>
          <li className={styles.contextMenuLi}>Delete</li>
          <li className={styles.contextMenuLi}>Mark as read</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatItem;
