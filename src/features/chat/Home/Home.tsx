import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  Clock, 
  Settings as SettingsIcon,
  Search,
  Phone,
  Video,
  UserPlus,
  Send
} from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import Contacts from '../Contacts/Contacts';
import Status from '../Status/Status';
import Settings from '../Settings/Settings';
import { authService } from '../../../shared/services/auth.service';
import ChatWidget1 from '../Chat/ChatWidget';
import ChatWidget2 from '../ChatWidget/ChatWidget';
import { useChat } from '../../../app/providers/ChatContext';
import { Chat, User } from '../../../shared/types';

type ActiveTab = 'chats' | 'contacts' | 'status' | 'settings';

// Enhanced Chat List Component
const ChatList: React.FC = () => {
  const { state, selectChat } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = authService.getUser();

  const getParticipantName = useCallback((chat: Chat) => {
    if (chat.type === 'group') {
      return chat.groupName || 'Group Chat';
    }
    
    const otherParticipant = chat.participants.find((p: User) => p._id !== currentUser?._id);
    return otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Unknown';
  }, [currentUser?._id]);

  const getParticipantAvatar = useCallback((chat: Chat) => {
    if (chat.type === 'group') {
      return chat.groupName?.charAt(0).toUpperCase() || 'G';
    }
    
    const otherParticipant = chat.participants.find((p: User) => p._id !== currentUser?._id);
    return otherParticipant ? 
      `${otherParticipant.firstName.charAt(0)}${otherParticipant.lastName.charAt(0)}`.toUpperCase() : 
      'U';
  }, [currentUser?._id]);

  const isParticipantOnline = useCallback((chat: Chat) => {
    if (chat.type === 'group') return false;
    
    const otherParticipant = chat.participants.find((p: User) => p._id !== currentUser?._id);
    return otherParticipant?.isOnline || false;
  }, [currentUser?._id]);

  const formatTime = useCallback((date: Date | string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }, []);

  const filteredChats = state.chats.filter(chat =>
    getParticipantName(chat).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chats</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <UserPlus size={20} />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>
      </div>

      {/* Chat List - Scrollable */}
      <div className="flex-1 overflow-y-auto chat-messages">
        {state.loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-medium">No chats yet</p>
              <p className="text-sm">Go to Contacts to start a conversation</p>
            </div>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <motion.div
              key={chat._id}
              whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
              onClick={() => selectChat(chat)}
              className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 ${
                state.selectedChat?._id === chat._id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {getParticipantAvatar(chat)}
                  </div>
                  {isParticipantOnline(chat) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {getParticipantName(chat)}
                    </p>
                    {chat.lastMessage && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(chat.lastMessage.createdAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {chat.lastMessage?.content || 'No messages yet'}
                    </p>
                    {chat.unreadCount && chat.unreadCount > 0 && (
                      <div className="bg-blue-600 text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-2 ml-2">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

// Enhanced Chat Window Component
const ChatWindow: React.FC = () => {
  const { state, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const currentUser = authService.getUser();

  const isParticipantOnline = useCallback((chat: Chat) => {
    if (chat.type === 'group') return false;
    
    const otherParticipant = chat.participants.find((p: User) => p._id !== currentUser?._id);
    return otherParticipant?.isOnline || false;
  }, [currentUser?._id]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !state.selectedChat || isSending) return;

    const messageContent = newMessage.trim();
    setNewMessage(''); // Clear input immediately
    setIsSending(true);

    try {
      await sendMessage(state.selectedChat._id, messageContent);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore message on error
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  }, [newMessage, state.selectedChat, isSending, sendMessage]);

  const formatTime = useCallback((date: Date | string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const getParticipantName = useCallback((chat: Chat) => {
    if (chat.type === 'group') {
      return chat.groupName || 'Group Chat';
    }
    
    const otherParticipant = chat.participants.find((p: User) => p._id !== currentUser?._id);
    return otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Unknown';
  }, [currentUser?._id]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  if (!state.selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <MessageCircle size={64} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Welcome to Chat</h3>
          <p>Select a conversation from the sidebar to start messaging</p>
          <p className="text-sm mt-2">Or go to Contacts to start a new conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 h-full">
      {/* Chat Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {state.selectedChat.type === 'group' 
                ? (state.selectedChat.groupName || 'G').charAt(0).toUpperCase()
                : 'U'
              }
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {getParticipantName(state.selectedChat)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isParticipantOnline(state.selectedChat) ? 'Online' : 'Last seen recently'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Phone size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Video size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 chat-messages" data-messages-container>
        {state.messages.map((message) => {
          const isOwn = message.sender._id === currentUser?._id;
          return (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                isOwn 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
              }`}>
                {message.replyTo && (
                  <div className="mb-2 p-2 bg-black bg-opacity-10 rounded text-xs">
                    <p className="font-medium opacity-80">{message.replyTo.sender.firstName}</p>
                    <p className="truncate opacity-75">{message.replyTo.content}</p>
                  </div>
                )}
                
                <p className="text-sm">{message.content}</p>
                
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <span className="text-xs opacity-70">
                    {formatTime(message.createdAt)}
                  </span>
                  {isOwn && (
                    <div className="text-xs opacity-70">
                      ✓✓
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Sending indicator */}
        {isSending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm bg-blue-600 text-white rounded-br-sm opacity-50">
              <p className="text-sm">Sending...</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Message Input - Fixed */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chats');

  const tabs = [
    { id: 'chats' as ActiveTab, label: 'Chats', icon: MessageCircle },
    { id: 'contacts' as ActiveTab, label: 'Contacts', icon: Users },
    { id: 'status' as ActiveTab, label: 'Status', icon: Clock },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: SettingsIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <div className="flex h-full">
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 h-full">
              <ChatList />
            </div>
            <div className="flex-1 h-full">
              <ChatWindow />
            </div>
          </div>
        );
      case 'contacts':
        return <Contacts />;
      case 'status':
        return <Status />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="flex h-full">
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 h-full">
              <ChatList />
            </div>
            <div className="flex-1 h-full">
              <ChatWindow />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Top Navigation Bar - Horizontal */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center py-3 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 mx-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={tab.label}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content - Takes remaining space */}
      <div className="flex-1 bg-white dark:bg-gray-800 overflow-hidden">
        <Routes>
          <Route path="/chat-widget1" element={<ChatWidget1 />} />
          <Route path="/chat-widget2" element={<ChatWidget2 />} />
          <Route path="*" element={renderContent()} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;