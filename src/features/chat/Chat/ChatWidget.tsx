import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Search,
  MoreVertical,
  ArrowLeft,
  Users,
  Settings,
  Loader
} from 'lucide-react';
import { useSocket } from '../../../app/providers/SocketContext';
import { chatService } from '../../../shared/services/chat.service';
import { authService } from '../../../shared/services/auth.service';
import { useCall } from '../../../app/providers/CallContext';
import { Chat, Message, User } from '../../../shared/types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'chats' | 'chat'>('chats');

  const socket = useSocket();
  const { initiateCall } = useCall();
  const currentUser = authService.getUser();
  const sendingRef = useRef<boolean>(false);

  // Socket Event Handlers
  useEffect(() => {
    if (!socket) return;

    const handleTyping = (data: { chatId: string; isTyping: boolean; userId: string }) => {
      if (selectedChat && data.chatId === selectedChat._id && data.userId !== currentUser?._id) {
        setOtherUserTyping(data.isTyping);
      }
    };

    const handleNewMessage = (message: Message) => {
      console.log('New message received:', message);
      if (selectedChat && message.chatId === selectedChat._id) {
        setMessages(prev => [...prev, message]);
      }
      
      setChats(prevChats =>
        prevChats.map(chat =>
          chat._id === message.chatId
            ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1, lastMessage: message }
            : chat
        )
      );

      if (!selectedChat || message.chatId !== selectedChat._id) {
        window.dispatchEvent(
          new CustomEvent('toast', {
            detail: {
              type: 'notification',
              message: `New message from ${message.sender.firstName}: ${message.content}`,
            },
          })
        );
      }
    };

    socket.on('userTyping', handleTyping);
    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('userTyping', handleTyping);
      socket.off('newMessage', handleNewMessage);
    };
  }, [selectedChat, currentUser, socket]);

  // Data Loaders
  const loadChats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await chatService.getUserChats();
      const chatsData = response.data?.chats || response.data?.items || [];
      setChats(chatsData);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (chatId: string) => {
    try {
      setLoading(true);
      const response = await chatService.getChatMessages(chatId);
      const messagesData = response.data?.messages || response.data?.items || [];
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Input & Send
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      if (selectedChat && socket) socket.sendTyping(selectedChat._id, true);
    } else if (isTyping && !e.target.value.trim()) {
      setIsTyping(false);
      if (selectedChat && socket) socket.sendTyping(selectedChat._id, false);
    }
  }, [isTyping, selectedChat, socket]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedChat || !socket || sendingRef.current) return;

    sendingRef.current = true;
    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const tempId = `temp_${Date.now()}_${Math.random()}`;
      
      socket.sendMessage({
        chatId: selectedChat._id,
        content: messageContent,
        tempId,
        messageType: 'text'
      });

      await chatService.sendMessage(selectedChat._id, messageContent);
      
      setIsTyping(false);
      socket.sendTyping(selectedChat._id, false);
    } catch (error) {
      console.error('Failed to send message:', error);
      setNewMessage(messageContent); // Restore message on error
    } finally {
      sendingRef.current = false;
    }
  }, [newMessage, selectedChat, socket]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Chat Selection
  const handleChatSelect = useCallback((chat: Chat) => {
    setSelectedChat(chat);
    setCurrentView('chat');
    if (socket) {
      socket.joinChat(chat._id);
    }
    loadMessages(chat._id);
    
    setChats(prevChats =>
      prevChats.map(c =>
        c._id === chat._id ? { ...c, unreadCount: 0 } : c
      )
    );
  }, [socket, loadMessages]);

  const handleBackToChats = useCallback(() => {
    setSelectedChat(null);
    setCurrentView('chats');
    setMessages([]);
  }, []);

  // Call handlers
  const handleVoiceCall = useCallback(() => {
    if (!selectedChat) return;
    
    const otherParticipants = selectedChat.participants.filter(p => {
      const user = (p as any).user || p;
      return user._id !== currentUser?._id;
    }).map(p => (p as any).user || p);
    
    if (otherParticipants.length > 0) {
      initiateCall(otherParticipants, 'voice', selectedChat._id);
    }
  }, [selectedChat, currentUser, initiateCall]);

  const handleVideoCall = useCallback(() => {
    if (!selectedChat) return;
    
    const otherParticipants = selectedChat.participants.filter(p => {
      const user = (p as any).user || p;
      return user._id !== currentUser?._id;
    }).map(p => (p as any).user || p);
    
    if (otherParticipants.length > 0) {
      initiateCall(otherParticipants, 'video', selectedChat._id);
    }
  }, [selectedChat, currentUser, initiateCall]);

  // Initial Load
  useEffect(() => {
    if (isOpen && authService.isAuthenticated()) {
      loadChats();
    }
  }, [isOpen, loadChats]);

  // Helper Functions
  const getChatDisplayName = useCallback((chat: Chat): string => {
    if (chat.type === 'group') {
      return chat.groupName || 'Group Chat';
    }
    
    const otherParticipant = chat.participants?.find(participant => {
      const user = (participant as any).user || participant;
      return user._id !== currentUser?._id;
    });
    
    if (otherParticipant) {
      const user = (otherParticipant as any).user || otherParticipant;
      return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
    }
    
    return 'Unknown User';
  }, [currentUser]);

  const formatMessageTime = useCallback((timestamp: string | Date): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const filteredChats = chats.filter(chat => {
    if (chat.groupName?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }
    
    return chat.participants?.some(participant => {
      const user = (participant as any).user || participant;
      return user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  if (!authService.isAuthenticated()) {
    return null;
  }

  return (
    <>
      {/* Chat Widget Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col z-40 overflow-hidden"
          >
            {currentView === 'chats' ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Chats</h3>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <Settings size={16} className="text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Search */}
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search chats..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader className="animate-spin text-blue-600" size={24} />
                    </div>
                  ) : filteredChats.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No chats found</p>
                      </div>
                    </div>
                  ) : (
                    filteredChats.map((chat) => (
                      <motion.div
                        key={chat._id}
                        onClick={() => handleChatSelect(chat)}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {chat.type === 'group' ? (
                              <Users size={16} />
                            ) : (
                              getChatDisplayName(chat).charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {getChatDisplayName(chat)}
                              </p>
                              {chat.unreadCount && chat.unreadCount > 0 && (
                                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                            {chat.lastMessage && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {chat.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleBackToChats}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <ArrowLeft size={16} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedChat?.type === 'group' ? (
                          <Users size={14} />
                        ) : (
                          getChatDisplayName(selectedChat!).charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {getChatDisplayName(selectedChat!)}
                        </h3>
                        {otherUserTyping && (
                          <p className="text-xs text-blue-600">typing...</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={handleVoiceCall}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Phone size={16} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button 
                        onClick={handleVideoCall}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Video size={16} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <MoreVertical size={16} className="text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3" data-messages-container>
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader className="animate-spin text-blue-600" size={24} />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.sender._id === currentUser?._id;
                      return (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg ${
                              isOwn
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              {formatMessageTime(message.createdAt)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Paperclip size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Smile size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;