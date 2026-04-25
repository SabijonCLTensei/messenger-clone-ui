import React, { useRef } from 'react'; // Import useRef
import { MessageSquare, Menu, Archive, Search, MenuIcon, Pin, X } from 'lucide-react'; // Import Pin and X icon
import ChatItem from './ChatItem'; // Import ChatItem
import styles from './LeftSidebar.module.css'; // Import CSS module
import clsx from 'clsx'; // For conditional classes
import type { Chat } from '../pages/MessengerLayout'; // Import Chat interface as a type

interface LeftSidebarProps {
  isVisible: boolean;
  onToggle: () => void;
  isArchived: boolean; // New prop for chat archived status
  isPinned: boolean; // New prop for chat pinned status
  onOpenNewMessageModal: () => void; // New prop to open new message modal
  chats: Chat[]; // New prop
  selectedChatId: string | null; // New prop
  onSelectChat: (chatId: string) => void; // New prop
  onEditAvatar: (chatId: string, newAvatarSrc: string) => void; // New prop for editing chat avatars
  onDeleteAvatar: (chatId: string) => void; // New prop for deleting chat avatars
  userAvatarSrc: string; // User's own avatar source
  onEditUserAvatar: (newAvatarSrc: string) => void; // Callback to edit user's own avatar
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isVisible, onToggle, isArchived, isPinned, onOpenNewMessageModal, chats, selectedChatId, onSelectChat, onEditAvatar, onDeleteAvatar, userAvatarSrc, onEditUserAvatar }) => {
  const userAvatarInputRef = useRef<HTMLInputElement>(null); // Ref for hidden file input for user avatar

  const handleUserAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newAvatarSrc = URL.createObjectURL(file);
      onEditUserAvatar(newAvatarSrc);
      e.target.value = ''; // Clear the input to allow selecting the same file again
    }
  };

  const handleDeleteUserAvatar = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening file picker
    onEditUserAvatar('https://via.placeholder.com/48'); // Reset to default avatar
  };

  const isDefaultUserAvatar = userAvatarSrc.includes('via.placeholder.com'); // Check if user has default avatar

  return (
    <div className={clsx(styles.sidebarContainer, !isVisible && styles.sidebarHidden, isArchived && styles.sidebarArchived)}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {/* Hamburger Menu for Mobile */}
          <MenuIcon className={clsx(styles.menuIcon)} onClick={onToggle} />
          {/* Hidden file input for user avatar */}
          <input
            type="file"
            accept="image/*"
            ref={userAvatarInputRef}
            style={{ display: 'none' }}
            onChange={handleUserAvatarChange}
          />
          {/* User Avatar */}
          <div className={clsx(styles.userAvatarWrapper, styles.userAvatarEditable)} onClick={() => userAvatarInputRef.current?.click()}>
            <img src={userAvatarSrc} alt="Your Avatar" className={styles.userAvatar} />
            {!isDefaultUserAvatar && (
              <button className={styles.deleteUserAvatarButton} onClick={handleDeleteUserAvatar} title="Remove Photo">
                <X size={16} />
              </button>
            )}
          </div>
          <span className={styles.userName} onClick={() => console.log('Your Name clicked')}>Your Name</span>
          {isPinned && <Pin className={styles.pinIcon} />} {/* Pin icon */}
          {/* Online Status Dot (Placeholder) */}
          <div className={styles.onlineDot} onClick={() => console.log('Online status dot clicked')}></div>
        </div>
        <div className={styles.headerRight}>
          {/* New Message Icon */}
          <MessageSquare
            className={styles.headerIcon}
            onClick={onOpenNewMessageModal} // Trigger modal
          />
          {/* Menu Icon */}
          <Menu className={styles.headerIcon} onClick={() => console.log('Header Menu icon clicked')} />
          {/* Archived Chats Icon */}
          <Archive className={styles.headerIcon} onClick={() => console.log('Header Archive icon clicked')} />
        </div>
      </div>

      {/* Story Section */}
      <div className={styles.storySection}>
        <div className={styles.storyItemsContainer}>
          {/* User's own story */}
          <div className={styles.storyItem} onClick={() => console.log('Your Story item clicked')}>
            <div className={styles.storyOwnAvatar}>
              <span className={styles.storyAddIcon}>+</span>
            </div>
            <span className={styles.storyName}>Your Story</span>
          </div>
          {/* Example Story Item with new story */}
          <div className={styles.storyItem} onClick={() => console.log('Friend Story item clicked (Friend 1)')}>
            <div className={styles.storyAvatarNew}>
              <img src="https://via.placeholder.com/60" alt="Story 1" className={styles.storyAvatar} />
            </div>
            <span className={styles.storyName}>Friend 1</span>
          </div>
          {/* Example Story Item without new story */}
          <div className={styles.storyItem} onClick={() => console.log('Friend Story item clicked (Friend 2)')}>
            <img src="https://via.placeholder.com/60" alt="Story 2" className={styles.storyAvatar} />
            <span className={styles.storyName}>Friend 2</span>
          </div>
          {/* More story items can be added here */}
        </div>
      </div>

      {/* Active Contacts Horizontal List */}
      <div className={styles.activeContactsSection}>
        <div className={styles.activeContactItemsContainer}>
          {/* Example Active Contact */}
          <div className={styles.activeContactItem} onClick={() => console.log('Active Contact clicked (Alice)')}>
            <div className={styles.activeContactAvatarWrapper}>
              <img src="https://via.placeholder.com/48" alt="Active 1" className={styles.activeContactAvatar} />
              <div className={styles.activeContactOnlineDot}></div>
            </div>
            <span className={styles.activeContactName}>Alice</span>
          </div>
          {/* Example Active Contact */}
          <div className={styles.activeContactItem} onClick={() => console.log('Active Contact clicked (Bob)')}>
            <div className={styles.activeContactAvatarWrapper}>
              <img src="https://via.placeholder.com/48" alt="Active 2" className={styles.activeContactAvatar} />
              <div className={styles.activeContactOnlineDot}></div>
            </div>
            <span className={styles.activeContactName}>Bob</span>
          </div>
          {/* Example Active Contact */}
          <div className={styles.activeContactItem} onClick={() => console.log('Active Contact clicked (Charlie)')}>
            <div className={styles.activeContactAvatarWrapper}>
              <img src="https://via.placeholder.com/48" alt="Active 3" className={styles.activeContactAvatar} />
              <div className={styles.activeContactOnlineDot}></div>
            </div>
            <span className={styles.activeContactName}>Charlie</span>
          </div>
          {/* More active contacts can be added here */}
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBarSection}>
        <div className={styles.searchInputContainer}>
          <Search className={styles.searchIcon} onClick={() => console.log('Search icon clicked (Left Sidebar)')} />
          <input
            type="text"
            placeholder="Search Messenger"
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className={styles.chatList}>
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chatId={chat.id}
            avatarSrc={chat.avatarSrc}
            contactName={chat.name}
            lastMessage={chat.lastMessage}
            timestamp={chat.timestamp}
            unreadCount={chat.unreadCount}
            isOnline={chat.isOnline}
            isSelected={chat.id === selectedChatId}
            onClick={onSelectChat}
            onEditAvatar={onEditAvatar}
            onDeleteAvatar={onDeleteAvatar}
          />
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;