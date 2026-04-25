import React, { useRef, useEffect, useState } from 'react';
import { format } from 'date-fns';
import styles from './MessageDisplay.module.css'; // Import CSS module
import clsx from 'clsx'; // For conditional classes

interface Message {
  id: string;
  sender: 'user' | 'ai'; // 'user' for sent, 'ai' for received
  text?: string; // Make text optional as image messages might not have text
  timestamp: Date;
  read?: boolean; // For sent messages
  reactions?: string[]; // Placeholder for reactions
  isForwarded?: boolean; // Indicates if the message is forwarded
  quotedMessage?: Pick<Message, 'sender' | 'text' | 'id'>; // For quoted replies
  imageUrl?: string; // Optional: URL for an image attachment
}

interface MessageDisplayProps {
  messages: Message[];
  isTyping?: boolean; // Indicates if the AI is typing
  onReact: (messageId: string, reaction: string) => void;
  onDeleteMessage: (messageId: string) => void; // Callback to delete a message
  onReplyMessage: (messageId: string) => void; // Callback to reply to a message
  onForwardMessage: (messageId: string) => void; // Callback to forward a message
  aiNickname: string | null; // AI's nickname
}


const MessageBubble: React.FC<{
  message: Message;
  onReact: (messageId: string, reaction: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReplyMessage: (messageId: string) => void;
  onForwardMessage: (messageId: string) => void;
  aiNickname: string | null;
}> = ({ message, onReact, onDeleteMessage, onReplyMessage, onForwardMessage, aiNickname }) => {
  const isSent = message.sender === 'user';
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleBubbleClick = () => {
    setShowReactionPicker(!showReactionPicker);
  };

  const handleReactionClick = (reaction: string) => {
    onReact(message.id, reaction);
    setShowReactionPicker(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default browser context menu
    setContextMenuPosition({ x: e.pageX, y: e.pageY });
    setContextMenuVisible(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
      setContextMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubble click
    onReact(message.id, '👍');
  };

  return (
    <div
      className={clsx(
        styles.messageBubble,
        isSent ? styles.messageBubbleSent : styles.messageBubbleReceived
      )}
      onClick={handleBubbleClick}
      onContextMenu={handleContextMenu}
    >
      {message.imageUrl && (
        <img src={message.imageUrl} alt="Message attachment" className={styles.messageImage} />
      )}
      {message.text && <p className={styles.messageText}>{message.text}</p>}
      {message.isForwarded && (
        <span className={styles.forwardedLabel}>Forwarded</span>
      )}
      {message.quotedMessage && (
        <div className={styles.quotedMessage}>
          <p className={styles.quotedSender}>{message.quotedMessage.sender === 'user' ? 'You' : aiNickname || 'AI'}</p>
          <p className={styles.quotedText}>{message.quotedMessage.text}</p>
        </div>
      )}
      <span className={styles.timestamp}>
        {format(message.timestamp, 'p')} {isSent && (message.read ? '✓✓' : '✓')}
      </span>
      {/* Like button - visible on hover or always, depending on styling */}
      <button className={styles.likeButton} onClick={handleLikeClick}>👍</button>

      {/* Reactions Display */}
      {message.reactions && message.reactions.length > 0 && (
        <div className={styles.reactionsDisplay}>
          {message.reactions[0]} {message.reactions.length > 1 && `+${message.reactions.length - 1}`}
        </div>
      )}

      {/* Reaction Picker */}
      {showReactionPicker && (
        <div className={styles.reactionPicker}>
          {reactions.map((reaction) => (
            <span
              key={reaction}
              className={styles.reactionEmoji}
              onClick={(e) => {
                e.stopPropagation(); // Prevent bubble click from toggling picker immediately
                handleReactionClick(reaction);
              }}
            >
              {reaction}
            </span>
          ))}
        </div>
      )}

      {/* Context Menu */}
      {contextMenuVisible && (
        <div
          ref={contextMenuRef}
          className={styles.contextMenu}
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
          onClick={(e) => e.stopPropagation()} // Prevent bubble click when clicking menu
        >
          <div className={styles.contextMenuItem} onClick={() => { onReplyMessage(message.id); setContextMenuVisible(false); }}>Reply</div>
          <div className={styles.contextMenuItem} onClick={() => { onForwardMessage(message.id); setContextMenuVisible(false); }}>Forward</div>
          <div className={styles.contextMenuItem} onClick={() => { onDeleteMessage(message.id); setContextMenuVisible(false); }}>Delete</div>
        </div>
      )}
    </div>
  );
};

const TypingIndicator: React.FC = () => {
  return (
    <div className={styles.typingIndicatorContainer}>
      <div className={styles.dotFlashing}></div>
      <div className={clsx(styles.dotFlashing, styles.dotFlashing2)}></div>
      <div className={clsx(styles.dotFlashing, styles.dotFlashing3)}></div>
    </div>
  );
};

const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages, isTyping, onReact, onDeleteMessage, onReplyMessage, onForwardMessage, aiNickname }) => {
  const formatDateSeparator = (date: Date) => {
    return format(date, 'PPP'); // e.g., Oct 23rd, 2023
  };

  let lastDate: string | null = null;

  return (
    <div className={styles.messageDisplayContainer}>
      {messages.map((message, _) => {
        const messageDate = formatDateSeparator(message.timestamp);
        const showDateSeparator = messageDate !== lastDate;
        lastDate = messageDate;

        return (
          <React.Fragment key={message.id}>
            {showDateSeparator && (
              <div className={styles.dateSeparator}>
                {messageDate}
              </div>
            )}
            <MessageBubble
              message={message}
              onReact={onReact}
              onDeleteMessage={onDeleteMessage}
              onReplyMessage={onReplyMessage}
              onForwardMessage={onForwardMessage}
              aiNickname={aiNickname}
            />
          </React.Fragment>
        );
      })}
      {isTyping && <TypingIndicator />}
    </div>
  );
};


export default MessageDisplay;
