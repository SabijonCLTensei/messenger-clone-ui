import React, { useState, useRef } from 'react';
import { Plus, Camera, Image, Smile, ThumbsUp, Send, Mic, X } from 'lucide-react'; // Import X for the remove button
import styles from './MessageComposer.module.css'; // Import CSS module

interface MessageComposerProps {
  onSendMessage: (messageContent: { text?: string; imageUrl?: string }) => void; // Updated prop to handle both text and images
}

const MessageComposer: React.FC<MessageComposerProps> = ({ onSendMessage }) => { // Removed onSendImage from destructuring
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      e.target.value = ''; // Clear the input to allow selecting the same file again
    }
  };

  const handleRemoveImage = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl); // Clean up the object URL
    }
    setImageFile(null);
    setImagePreviewUrl(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = ''; // Clear the input file selection
    }
  };

  const handleSendMessage = () => {
    if (imageFile || message.trim()) {
      onSendMessage({
        text: message.trim() || undefined, // Only include text if it exists
        imageUrl: imagePreviewUrl || undefined, // Only include image URL if it exists
      });
      setMessage('');
      handleRemoveImage(); // Clear image after sending
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default Enter behavior (e.g., new line)
      handleSendMessage();
    }
  };

  return (
    <div className={styles.messageComposerContainer}>
      {imagePreviewUrl && (
        <div className={styles.imagePreviewContainer}>
          <img src={imagePreviewUrl} alt="Preview" className={styles.imagePreview} />
          <button className={styles.removeImageButton} onClick={handleRemoveImage}>
            <X size={16} />
          </button>
        </div>
      )}
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />

      <div className={styles.composerContent}>
        {/* Left Icons */}
        <div className={styles.leftIcons}>
          <Plus className={styles.icon} />
          <Camera className={styles.icon} />
          {/* Trigger hidden file input on Image icon click */}
          <Image className={styles.icon} onClick={() => imageInputRef.current?.click()} />
          {/* Placeholder for Sticker Picker */}
          <div className={styles.stickerIcon}>
            <span className={styles.stickerEmoji}>😊</span> {/* Unicode emoji as placeholder for sticker icon */}
          </div>
          {/* GIF Search Placeholder */}
          <div className={styles.gifIcon}>
            <span className={styles.gifText}>GIF</span>
          </div>
        </div>

        {/* Message Input */}
        <div className={styles.messageInputContainer}>
          <input
            type="text"
            placeholder="Aa"
            className={styles.messageInput}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={!!imageFile} // Disable text input if an image is selected for simplicity
          />
          <Smile className={styles.emojiIcon} />
        </div>
{/* Right Icon (Like/Send/Voice) */}
<div className={styles.rightIcons}>
  {!(message.trim() || imageFile) && ( // If no message or image, show Mic and ThumbsUp
    <>
      <Mic className={styles.micIcon} onClick={() => console.log('Mic icon clicked')} />
      <ThumbsUp className={styles.thumbsUpIcon} onClick={() => console.log('ThumbsUp icon clicked')} />
    </>
  )}
  <Send
    className={styles.sendIcon}
    onClick={handleSendMessage}
  /></div></div>
</div>
  );
};

export default MessageComposer;
