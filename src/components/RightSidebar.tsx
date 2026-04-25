import React from 'react';
import { X, Search, BellOff, Lock, Ban, Settings, MessageSquare, Palette, Smile, Archive, Pin, Terminal, Globe } from 'lucide-react'; // Import Settings icon
import styles from './RightSidebar.module.css'; // Import CSS module
import clsx from 'clsx'; // For conditional classes

interface RightSidebarProps {
  isVisible: boolean;
  onClose: () => void;
  contactName: string;
  onSelectTheme: (theme: string) => void; // New prop for theme selection
  currentTheme: string; // New prop for current theme
  nickname: string | null; // New prop for nickname
  onSetNickname: (nickname: string | null) => void; // New prop for setting nickname
  chatEmoji: string | null; // New prop for chat-specific emoji
  onSetChatEmoji: (emoji: string | null) => void; // New prop for setting chat-specific emoji
  isChatArchived: boolean; // New prop for chat archived status
  onToggleArchive: (isArchived: boolean) => void; // New prop for toggling archive status
  isChatPinned: boolean; // New prop for chat pinned status
  onTogglePin: (isPinned: boolean) => void; // New prop for toggling pin status
  // New props for AI model selection
  availableAiModels: string[];
  currentAiModel: string | null;
  onSelectAiModel: (model: string) => void;
  // New props for AI interaction mode
  aiInteractionMode: 'web' | 'terminal';
  onSetAiInteractionMode: (mode: 'web' | 'terminal') => void;
}

// Helper component for grouping settings
const SettingGroup: React.FC<{ title: string; children: React.ReactNode; icon?: React.ElementType }> = ({ title, children, icon: Icon }) => (
  <div className={styles.settingGroup}>
    <h3 className={styles.settingGroupTitle}>
      {Icon && <Icon className={styles.settingGroupIcon} />}
      {title}
    </h3>
    <div className={styles.settingGroupContent}>
      {children}
    </div>
  </div>
);

const RightSidebar: React.FC<RightSidebarProps> = ({
  isVisible,
  onClose,
  contactName,
  onSelectTheme,
  currentTheme,
  nickname,
  onSetNickname,
  chatEmoji,
  onSetChatEmoji,
  isChatArchived,
  onToggleArchive,
  isChatPinned,
  onTogglePin,
  availableAiModels,
  currentAiModel,
  onSelectAiModel,
  aiInteractionMode,
  onSetAiInteractionMode,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className={clsx(styles.sidebarContainer, !isVisible && styles.sidebarHidden)}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>{contactName}</h2>
        <X className={styles.closeIcon} onClick={onClose} />
      </div>

      <div className={styles.sidebarContentScrollable}>
        {/* Contact Details Section */}
        <SettingGroup title="Contact Info">
          <div className={styles.contactDetailsContent}>
            <img src="https://via.placeholder.com/100" alt={contactName} className={styles.contactAvatar} />
            <h3 className={styles.contactName} onClick={() => console.log('Contact Name / Nickname clicked')}>{nickname || contactName}</h3> {/* Display nickname if available */}
            <p className={styles.contactStatus}>Active now</p>
          </div>
          <div className={styles.viewProfileButtonContainer}>
            <button className={styles.viewProfileButton} onClick={() => console.log('View Profile button clicked')}>
              View Profile
            </button>
          </div>
          {/* Nickname Setting */}
          <div className={styles.nicknameSetting}>
            <label htmlFor="nickname" className={styles.nicknameLabel}>Set Nickname</label>
            <input
              type="text"
              id="nickname"
              className={styles.nicknameInput}
              value={nickname || ''}
              onChange={(e) => onSetNickname(e.target.value || null)}
              placeholder="Enter nickname"
            />
          </div>
        </SettingGroup>

        {/* Media/Files/Links Section */}
        <SettingGroup title="Shared Media" icon={Settings}>
          <div className={styles.sharedMediaTabs}>
            <span className={clsx(styles.sharedMediaTab, styles.activeTab)} onClick={() => console.log('Shared Media Tab clicked: Media')}>Media</span>
            <span className={styles.sharedMediaTab} onClick={() => console.log('Shared Media Tab clicked: Files')}>Files</span>
            <span className={styles.sharedMediaTab} onClick={() => console.log('Shared Media Tab clicked: Links')}>Links</span>
          </div>
          <div className={styles.sharedMediaGrid}>
            {/* Placeholder for shared media */}
            <img src="https://via.placeholder.com/60" alt="media" className={styles.sharedMediaItem} onClick={() => console.log('Shared Media Item clicked')} />
            <img src="https://via.placeholder.com/60" alt="media" className={styles.sharedMediaItem} onClick={() => console.log('Shared Media Item clicked')} />
            <img src="https://via.placeholder.com/60" alt="media" className={styles.sharedMediaItem} onClick={() => console.log('Shared Media Item clicked')} />
            <img src="https://via.placeholder.com/60" alt="media" className={styles.sharedMediaItem} onClick={() => console.log('Shared Media Item clicked')} />
            <img src="https://via.placeholder.com/60" alt="media" className={styles.sharedMediaItem} onClick={() => console.log('Shared Media Item clicked')} />
            <img src="https://via.placeholder.com/60" alt="media" className={styles.sharedMediaItem} onClick={() => console.log('Shared Media Item clicked')} />
          </div>
          <button className={styles.viewAllButton} onClick={() => console.log('View All Shared Media button clicked')}>View All</button>
        </SettingGroup>

        {/* Search in Conversation */}
        <SettingGroup title="Search in Conversation" icon={Search}>
          <div className={styles.searchConversationInputContainer}>
            <Search className={styles.searchConversationIcon} onClick={() => console.log('Search icon clicked (Right Sidebar)')} />
            <input
              type="text"
              placeholder="Search here"
              className={styles.searchConversationInput}
            />
          </div>
        </SettingGroup>

        {/* Chat Settings */}
        <SettingGroup title="Chat Settings" icon={MessageSquare}>
          <div className={clsx(styles.optionItem)} onClick={() => console.log('Mute Conversation option clicked')}>
            <BellOff className={styles.optionIcon} />
            <span>Mute Conversation</span>
          </div>
          {/* Theme Selection */}
          <div className={styles.settingRow}>
            <Palette className={styles.optionIcon} />
            <span>Chat Theme</span>
            <select
              className={styles.themeSelect}
              value={currentTheme}
              onChange={(e) => onSelectTheme(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          {/* Chat Emoji Selection */}
          <div className={styles.settingRow}>
            <Smile className={styles.optionIcon} />
            <span>Chat Emoji</span>
            <input
              type="text"
              className={styles.emojiInput}
              value={chatEmoji || '👍'} // Default to thumbs up
              onChange={(e) => onSetChatEmoji(e.target.value)}
              maxLength={2} // Limit to a single emoji (or a couple if combined)
            />
          </div>
          {/* Archive Chat */}
          <div className={styles.settingRow}>
            <Archive className={styles.optionIcon} />
            <span>Archive Chat</span>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                className={styles.toggleInput}
                checked={isChatArchived}
                onChange={(e) => onToggleArchive(e.target.checked)}
              />
              <div className={styles.toggleSlider}></div>
            </label>
          </div>
          {/* Pin Chat */}
          <div className={styles.settingRow}>
            <Pin className={styles.optionIcon} />
            <span>Pin Chat</span>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                className={styles.toggleInput}
                checked={isChatPinned}
                onChange={(e) => onTogglePin(e.target.checked)}
              />
              <div className={styles.toggleSlider}></div>
            </label>
          </div>
        </SettingGroup>

        {/* Gemini Model Selection and Interaction Mode */}
        {contactName === 'Gemini AI' && (
          <>
            <SettingGroup title="AI Settings" icon={Settings}>
              <div className={styles.settingRow}>
                <span>Gemini Model</span>
                <select
                  className={styles.aiModelSelect}
                  value={currentAiModel || ''}
                  onChange={(e) => onSelectAiModel(e.target.value)}
                >
                  {availableAiModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
              {/* AI Interaction Mode Selection */}
              <div className={styles.settingRow}>
                <span>Interaction Mode</span>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="aiInteractionMode"
                      value="web"
                      checked={aiInteractionMode === 'web'}
                      onChange={() => onSetAiInteractionMode('web')}
                      className={styles.radioInput}
                    />
                    <Globe className={styles.radioIcon} /> Web UI
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="aiInteractionMode"
                      value="terminal"
                      checked={aiInteractionMode === 'terminal'}
                      onChange={() => onSetAiInteractionMode('terminal')} // Only set mode, no launch
                      className={styles.radioInput}
                    />
                    <Terminal className={styles.radioIcon} /> Terminal
                  </label>
                </div>
              </div>
            </SettingGroup>

            {aiInteractionMode === 'terminal' && (
              <SettingGroup title="Terminal Commands" icon={Terminal}>
                <p className={styles.terminalInstruction}>
                  To interact with the AI via terminal, open Termux and run:
                </p>
                <code className={styles.terminalCommand}>
                  bash /data/data/com.termux/files/home/llama.cpp/AI-Domain/chat.sh
                </code>
                <p className={styles.terminalInstruction}>
                  Ensure the `y-ai` server is running (usually started by `y-ai` command or `./start.sh` in the AI-Domain directory).
                </p>
              </SettingGroup>
            )}
          </>
        )}

        {/* Privacy & Support */}
        <SettingGroup title="Privacy & Support" icon={Lock}>
          <div className={clsx(styles.optionItem)} onClick={() => console.log('Privacy & Support option clicked')}>
            <Lock className={styles.optionIcon} />
            <span>Privacy & Support</span>
          </div>
          <div className={clsx(styles.optionItem, styles.optionItemDanger)} onClick={() => console.log('Block Gemini AI option clicked')}>
            <Ban className={styles.optionIcon} />
            <span>Block Gemini AI</span>
          </div>
        </SettingGroup>
      </div>
    </div>
  );
};

export default RightSidebar;
