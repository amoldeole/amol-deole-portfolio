import React, { useState } from 'react';
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
import Contacts from '../../components/Contacts/Contacts';
import Status from '../../components/Status/Status';
import Settings from '../../components/Settings/Settings';
import { useChat } from '../../contexts/ChatContext';
import { authService } from '../../services/auth.service';
import { Chat, User } from '../../types/chat';
import ChatWidget1 from '../../components/Chat/ChatWidget';
import ChatWidget2 from '../../components/ChatWidget/ChatWidget';

type ActiveTab = 'chats' | 'contacts' | 'status' | 'settings';

// Enhanced Chat List Component
const ChatList: React.FC = () => {
  const { state, selectChat } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = authService.getUser();

  const getParticipantName = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.groupName || 'Group Chat';
    }
    
    const otherParticipant = chat.participants.find((p: User) => p._id !== currentUser?._id);
    return otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Unknown';
  };

  const getParticipantAvatar = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.groupName?.charAt(0).toUpperCase() || 'G';
    }
    
    const otherParticipant = chat.participants.find((p: User) => p._id !== currentUser?._id);
    return otherParticipant ? 
      `${otherParticipant.firstName.charAt(0)}${otherParticipant.lastName.charAt(0)}`.toUpperCase() : 
      'U';
  };

  const isParticipantOnline = (chat: Chat) => {
    if (chat.type === 'group') return false;
    
    const otherParticipant = chat.participants.find((p: User) => p._id !== currentUser?._id);
    return otherParticipant?.isOnline || false;
  };

  const formatTime = (date: Date | string) => {
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
  };

  const filteredChats = state.chats.filter(chat =>
    getParticipantName(chat).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
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
                    {chat.unreadCount > 0 && (
                      <div className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
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
  const currentUser = authService.getUser();

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

  const getParticipantName = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.groupName || 'Group Chat';
    }
    
    const otherParticipant = chat.participants.find((p: User) => p._id !== currentUser?._id);
    return otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Unknown';
  };

  const isParticipantOnline = (chat: Chat) => {
    if (chat.type === 'group') return false;
    
    const otherParticipant = chat.participants.find((p: User) => p._id !== currentUser?._id);
    return otherParticipant?.isOnline || false;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !state.selectedChat) return;

    try {
      await sendMessage(state.selectedChat._id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 chat-background">
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
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
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
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
              <ChatList />
            </div>
            <ChatWindow />
          </div>
        );
      case 'contacts':
        return <Contacts />;
      case 'status':
        return <Status />;
      case 'settings':
        return <Settings />;
      default:
        return <ChatList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-3 rounded-lg mb-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={tab.label}
                >
                  <Icon size={24} />
                </button>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white dark:bg-gray-800">
            <Routes>
              <Route path="/chat-widget1" element={<ChatWidget1 />} />
              <Route path="/chat-widget2" element={<ChatWidget2 />} />
              <Route path="*" element={renderContent()} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;