import React, { useState, useEffect, useCallback } from 'react';
import LeftSidebar from '../components/LeftSidebar';
import ChatHeader from '../components/ChatHeader';
import MessageDisplay from '../components/MessageDisplay';
import MessageComposer from '../components/MessageComposer';
import RightSidebar from '../components/RightSidebar'; // Import RightSidebar
import { getAiPort, getAiChatResponse } from '../services/aiService'; // Import AI service functions
import NewMessageModal from '../components/NewMessageModal'; // Import NewMessageModal
import styles from './MessengerLayout.module.css'; // Import CSS module
import clsx from 'clsx'; // For conditional classes

interface Message {
  id: string;
  chatId: string; // Add chatId to Message interface
  sender: 'user' | 'ai'; // 'user' for sent, 'ai' for received
  text?: string; // Make text optional as messages can be just images
  imageUrl?: string; // Add imageUrl for image attachments
  timestamp: Date;
  read?: boolean; // For sent messages
  reactions?: string[]; // Placeholder for reactions
  isForwarded?: boolean; // Indicates if the message is forwarded
  quotedMessage?: Pick<Message, 'sender' | 'text' | 'id'>; // For quoted replies
}

interface AIMessage {
  role: 'user' | 'model';
  content?: string;
}

export interface Chat {
  id: string;
  name: string;
  avatarSrc: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  isAiChat: boolean; // Indicates if this is an AI chat
}


const MessengerLayout: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Map<string, Message[]>>(new Map());
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 'user-self',
      name: 'Your Profile',
      avatarSrc: 'https://via.placeholder.com/48', // Default user avatar
      lastMessage: '',
      timestamp: new Date(),
      unreadCount: 0,
      isOnline: true,
      isAiChat: false,
    },
    {
      id: 'gemini-ai',
      name: 'Gemini AI',
      avatarSrc: 'https://via.placeholder.com/48',
      lastMessage: 'Hello there! How can I help you today?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      unreadCount: 1,
      isOnline: true,
      isAiChat: true,
    },
    {
      id: 'user-hint',
      name: 'User Hint',
      avatarSrc: 'https://via.placeholder.com/48',
      lastMessage: 'Don\'t forget to add more context next time.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadCount: 0,
      isOnline: false,
      isAiChat: false,
    },
    {
      id: 'developer-buddy',
      name: 'Developer Buddy',
      avatarSrc: 'https://via.placeholder.com/48',
      lastMessage: 'Working on the new feature, will push tonight.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      unreadCount: 0,
      isOnline: true,
      isAiChat: false,
    },
    {
      id: 'project-manager',
      name: 'Project Manager',
      avatarSrc: 'https://via.placeholder.com/48',
      lastMessage: 'Meeting at 10 AM tomorrow.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      unreadCount: 2,
      isOnline: false,
      isAiChat: false,
    },
  ]);
  const [userAvatarSrc, setUserAvatarSrc] = useState<string>('https://via.placeholder.com/48'); // State for main user avatar
  const [isTyping, setIsTyping] = useState(false);
  const [aiPort, setAiPort] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false); // State for right sidebar visibility
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true); // State for left sidebar visibility (default true for desktop)
  const [currentTheme, setCurrentTheme] = useState('default'); // New state for theme
  const [nickname, setNickname] = useState<string | null>(null); // New state for nickname
  const [chatEmoji, setChatEmoji] = useState<string | null>(null); // New state for chat-specific emoji
  const [isChatArchived, setIsChatArchived] = useState(false); // New state for chat archiving
  const [isChatPinned, setIsChatPinned] = useState(false); // New state for chat pinning
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false); // State for new message modal visibility
  const [currentView, setCurrentView] = useState<'sidebar' | 'chat'>('sidebar'); // New state for mobile view management
  const [availableAiModels] = useState<string[]>(['Qwen 2.5 0.5B', 'gemini-pro', 'gemini-flash']); // Example models - Updated with Qwen
  const [currentAiModel, setCurrentAiModel] = useState<string | null>('Qwen 2.5 0.5B'); // Default AI model - Updated to Qwen
  const [aiInteractionMode, setAiInteractionMode] = useState<'web' | 'terminal'>('web'); // New state for AI interaction mode
  const [userConfiguredAiPort, setUserConfiguredAiPort] = useState<number | null>(null); // New state for user-configured AI port

  useEffect(() => {
    // Apply dark-mode class to body based on theme
    if (currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [currentTheme]);

  useEffect(() => {
    const fetchPort = async () => {
      let resolvedPort: number | null = null;

      if (userConfiguredAiPort) {
        resolvedPort = userConfiguredAiPort;
      } else {
        resolvedPort = await getAiPort(); // Dynamically read from ai-port.txt
      }

      if (resolvedPort) {
        setAiPort(resolvedPort);
        setError(null); // Clear any previous errors
        // Initialize AI chat history
        setChatHistory((prev) => {
          const newHistory = new Map(prev);
          if (!newHistory.has('gemini-ai')) {
            newHistory.set('gemini-ai', [
              { id: 'initial-ai', chatId: 'gemini-ai', sender: 'ai', text: 'Hello! How can I assist you today?', timestamp: new Date() },
            ]);
          }
          return newHistory;
        });
        setSelectedChatId('gemini-ai'); // Select AI chat by default
      } else {
        setError('Failed to connect to AI server. Please ensure `y-ai` is running, or specify the correct port in settings.');
      }
    };
    fetchPort();
  }, [currentTheme, userConfiguredAiPort]); // Re-fetch port if user-configured port changes or theme changes (though theme change doesn't affect port, it's a good practice to include it if related state is in the effect)

  const handleEditAvatar = useCallback((chatId: string, newAvatarSrc: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === chatId ? { ...chat, avatarSrc: newAvatarSrc } : chat))
    );
  }, []);

  const handleDeleteAvatar = useCallback((chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, avatarSrc: 'https://via.placeholder.com/48' } : chat
      )
    );
  }, []);

  const handleSelectChat = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
    // Optionally mark messages as read when a chat is selected
    setChatHistory((prev) => {
      const newHistory = new Map(prev);
      const chatMessages = newHistory.get(chatId);
      if (chatMessages) {
        newHistory.set(
          chatId,
          chatMessages.map((msg) => (msg.sender === 'ai' ? { ...msg, read: true } : msg))
        );
      }
      return newHistory;
    });
    // Also update unread count for the selected chat
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat))
    );
    setCurrentView('chat'); // Switch to chat view on mobile
  }, []);

  const handleSendMessage = async (messageContent: { text?: string; imageUrl?: string }) => {
    const { text, imageUrl } = messageContent;

    if (!selectedChatId) return; // Cannot send message if no chat is selected
    if (!text && !imageUrl) return; // Cannot send empty message

    const currentChat = chats.find(chat => chat.id === selectedChatId);
    if (!currentChat) return; // Should not happen if selectedChatId is valid

    const newUserMessage: Message = {
      id: String(new Date().getTime()), // Use timestamp for unique ID
      chatId: selectedChatId,
      sender: 'user',
      text,
      imageUrl, // Correctly include imageUrl
      timestamp: new Date(),
      read: false,
    };

    setChatHistory((prev) => {
      const newHistory = new Map(prev);
      const currentChatMessages = newHistory.get(selectedChatId) || [];
      newHistory.set(selectedChatId, [...currentChatMessages, newUserMessage]);
      return newHistory;
    });

    // Update last message and timestamp for the selected chat
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              lastMessage: imageUrl ? "Image" : text || "", // Show "Image" or text
              timestamp: new Date(),
              unreadCount: 0,
            }
          : chat
      )
    );

    if (currentChat.isAiChat) {
      // Use the resolved AI port (either user-configured or dynamically fetched)
      const portToUse = userConfiguredAiPort || aiPort;
      if (!portToUse) {
        setError('AI server is not connected. Please ensure `y-ai` is running, or specify the correct port in settings.');
        return;
      }

      // If interaction mode is terminal, we don't send message via web API
      if (aiInteractionMode === 'terminal') {
        setError('AI is in terminal interaction mode. Please switch to Web UI mode to chat here.');
        return;
      }

      setIsTyping(true);

      const temporaryAiMessageId = String(new Date().getTime() + 1);
      setChatHistory((prev) => {
        const newHistory = new Map(prev);
        const currentChatMessages = newHistory.get(selectedChatId) || [];
        newHistory.set(selectedChatId, [
          ...currentChatMessages,
          {
            id: temporaryAiMessageId,
            chatId: selectedChatId,
            sender: 'ai',
            text: '', // Start with empty text for streaming
            timestamp: new Date(),
          },
        ]);
        return newHistory;
      });

      let accumulatedAiResponse = '';
      const onChunk = (chunk: string) => {
        accumulatedAiResponse += chunk;
        setChatHistory((prev) => {
          const newHistory = new Map(prev);
          const currentChatMessages = newHistory.get(selectedChatId);
          if (currentChatMessages) {
            const updatedMessages = currentChatMessages.map((msg) =>
              msg.id === temporaryAiMessageId ? { ...msg, text: accumulatedAiResponse } : msg
            );
            newHistory.set(selectedChatId, updatedMessages);
          }
          return newHistory;
        });
      };

      const onFinish = () => {
        setIsTyping(false);
        setError(null); // Clear error on successful completion
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === selectedChatId
              ? { ...chat, lastMessage: accumulatedAiResponse, timestamp: new Date() } // Update AI chat last message
              : chat
          )
        );
      };

      try {
        // For AI chats, only send text content. If only an image was sent, send a placeholder text.
        const aiPromptText = text || (imageUrl ? "User sent an image." : "");

        // Get previous messages for context
        const messagesForAI: AIMessage[] = chatHistory.get(selectedChatId)?.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          content: msg.text
        })) || [];
        await getAiChatResponse(aiPromptText, portToUse, onChunk, onFinish, messagesForAI, currentAiModel || undefined);
      } catch (err) {
        console.error('Error getting AI response (stream):', err);
        setError(`Error communicating with AI: ${err instanceof Error ? err.message : String(err)}`);
        setIsTyping(false); // Ensure typing indicator is off even on error
      }
    }
  };

  const handleReact = useCallback((messageId: string, reaction: string) => {
    setChatHistory((prev) => {
      const newHistory = new Map(prev);
      if (selectedChatId) {
        const currentChatMessages = newHistory.get(selectedChatId) || [];
        const updatedMessages = currentChatMessages.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: msg.reactions?.includes(reaction)
                  ? msg.reactions.filter((r) => r !== reaction)
                  : [...(msg.reactions || []), reaction],
              }
            : msg
        );
        newHistory.set(selectedChatId, updatedMessages);
      }
      return newHistory;
    });
  }, [selectedChatId]);

  const handleDeleteMessage = useCallback((messageId: string) => {
    setChatHistory((prev) => {
      const newHistory = new Map(prev);
      if (selectedChatId) {
        const currentChatMessages = newHistory.get(selectedChatId) || [];
        const updatedMessages = currentChatMessages.filter((msg) => msg.id !== messageId);
        newHistory.set(selectedChatId, updatedMessages);
      }
      return newHistory;
    });
  }, [selectedChatId]);

  const handleReplyMessage = useCallback((messageId: string) => {
    console.log(`Reply to message: ${messageId}`);
    // Future implementation: set state to indicate a reply is in progress,
    // potentially pre-fill the composer or show a reply UI.
  }, []);

  const handleForwardMessage = useCallback((messageId: string) => {
    console.log(`Forward message: ${messageId}`);
    // Future implementation: open a modal to select contacts to forward to.
  }, []);

  const toggleRightSidebar = () => {
    setIsRightSidebarVisible(!isRightSidebarVisible);
  };

  const toggleLeftSidebar = () => {
    setIsLeftSidebarVisible(!isLeftSidebarVisible);
  };

  const handleStartChat = (contactId: string) => {
    // For now, simply close the modal.
    // In a full implementation, this would switch to the new chat.
    console.log(`Starting chat with contact ID: ${contactId}`);
    setIsNewMessageModalOpen(false);
  };

  const currentChat = chats.find(chat => chat.id === selectedChatId);

  const handleBackToSidebar = useCallback(() => {
    setCurrentView('sidebar');
  }, []);

  const handleEditUserAvatar = useCallback((newAvatarSrc: string) => {
    setUserAvatarSrc(newAvatarSrc);
  }, []);

  return (
    <div className={clsx(styles.layoutContainer)}>
      {/* Left Sidebar */}
      <div className={clsx(styles.sidebarWrapper, currentView === 'sidebar' && styles.showSidebarOnMobile)}>
        <LeftSidebar
          isVisible={currentView === 'sidebar'}
          onToggle={toggleLeftSidebar}
          isArchived={isChatArchived}
          isPinned={isChatPinned}
          onOpenNewMessageModal={() => setIsNewMessageModalOpen(true)}
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onEditAvatar={handleEditAvatar} // Pass the new prop
          onDeleteAvatar={handleDeleteAvatar} // Pass the new prop
          userAvatarSrc={userAvatarSrc} // Pass user's own avatar
          onEditUserAvatar={handleEditUserAvatar} // Pass the new prop
        />
      </div>

      {/* Center Chat Area */}
      <div className={clsx(styles.centerChatArea, currentView === 'sidebar' && styles.hideOnMobile, currentView === 'chat' && styles.showOnMobileChat)}>
        {!selectedChatId ? (
          <div className={styles.selectConversationPlaceholder}>
            Select a conversation to start chatting.
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <ChatHeader
              avatarSrc={currentChat?.avatarSrc || ""}
              contactName={currentChat?.name || ""}
              status={currentChat?.isAiChat && (userConfiguredAiPort || aiPort) ? "Active now" : currentChat?.isOnline ? "Online" : "Offline"}
              onInfoClick={toggleRightSidebar}
              nickname={nickname}
              chatEmoji={chatEmoji}
              onBackClick={handleBackToSidebar} // Pass back handler
              isMobileView={currentView === 'chat'} // Pass to ChatHeader for back button visibility
            />

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            {/* Message Display Area */}
            <MessageDisplay
              messages={chatHistory.get(selectedChatId) || []}
              isTyping={isTyping}
              onReact={handleReact}
              onDeleteMessage={handleDeleteMessage}
              onReplyMessage={handleReplyMessage} // Pass reply handler
              onForwardMessage={handleForwardMessage} // Pass forward handler
              aiNickname={nickname}
            />

            {/* Message Composer */}
            <MessageComposer onSendMessage={handleSendMessage} />
          </>
        )}
      </div>

      {/* Right Sidebar */}
      <RightSidebar
        isVisible={isRightSidebarVisible}
        onClose={toggleRightSidebar}
        contactName={currentChat?.name || "Chat Info"} // Use current chat's name
        onSelectTheme={setCurrentTheme} // Pass theme setter
        currentTheme={currentTheme} // Pass current theme
        nickname={nickname} // Pass nickname
        onSetNickname={setNickname} // Pass nickname setter
        chatEmoji={chatEmoji} // Pass chat emoji
        onSetChatEmoji={setChatEmoji} // Pass chat emoji setter
        isChatArchived={isChatArchived} // Pass archive status
        onToggleArchive={setIsChatArchived} // Pass archive toggler
        isChatPinned={isChatPinned} // Pass pin status
        onTogglePin={setIsChatPinned} // Pass pin toggler
        availableAiModels={availableAiModels} // Pass available AI models
        currentAiModel={currentAiModel} // Pass current AI model
        onSelectAiModel={setCurrentAiModel} // Pass AI model setter
        aiInteractionMode={aiInteractionMode} // Pass AI interaction mode
        onSetAiInteractionMode={setAiInteractionMode} // Pass setter for interaction mode
        userConfiguredAiPort={userConfiguredAiPort} // Pass user-configured AI port
        onSetUserConfiguredAiPort={setUserConfiguredAiPort} // Pass setter for user-configured AI port
      />
      {isNewMessageModalOpen && (
        <NewMessageModal
          isOpen={isNewMessageModalOpen}
          onClose={() => setIsNewMessageModalOpen(false)}
          onStartChat={handleStartChat}
        />
      )}
    </div>
  );
  };
  export default MessengerLayout;