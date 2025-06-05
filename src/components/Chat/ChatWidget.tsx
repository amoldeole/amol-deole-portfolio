import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Phone, 
  Video, 
  Paperclip, 
  Smile,
  Search,
  ArrowLeft,
  Reply,
  Check,
  CheckCheck,
  MoreVertical
} from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useCall } from '../../contexts/CallContext';
import { authService } from '../../services/auth.service';
import { Chat, Message, User } from '../../types/chat';

const ChatWidget: React.FC = () => {
  const { state, loadChats, selectChat, sendMessage, sendTyping } = useChat();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const { initiateCall } = useCall();
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen && authService.isAuthenticated()) {
      loadChats();
    }
  }, [isOpen, loadChats]);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  useEffect(() => {
    if (state.selectedChat && isTyping) {
      sendTyping(state.selectedChat._id, true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        sendTyping(state.selectedChat!._id, false);
      }, 1000);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, state.selectedChat, sendTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !state.selectedChat) return;

    try {
      await sendMessage(
        state.selectedChat._id, 
        newMessage.trim(), 
        undefined, // files
        replyingTo?._id // replyTo
      );
      setNewMessage('');
      setReplyingTo(null);
      setIsTyping(false);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        sendTyping(state.selectedChat._id, false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
    } else if (isTyping && !e.target.value.trim()) {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceCall = () => {
    if (state.selectedChat) {
      const currentUser = authService.getUser();
      const otherParticipants = state.selectedChat.participants.filter(p => p._id !== currentUser?._id);
      initiateCall(otherParticipants, 'voice', state.selectedChat._id);
    }
  };

  const handleVideoCall = () => {
    if (state.selectedChat) {
      const currentUser = authService.getUser();
      const otherParticipants = state.selectedChat.participants.filter(p => p._id !== currentUser?._id);
      initiateCall(otherParticipants, 'video', state.selectedChat._id);
    }
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (date: Date | string) => {
    const now = new Date();
    const lastSeen = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return lastSeen.toLocaleDateString();
  };

  const getParticipantName = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.groupName || 'Group Chat';
    }
    
    const currentUser = authService.getUser();
    const otherParticipant = chat.participants.find((p: User) => p._id !== currentUser?._id);
    return otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Unknown';
  };

  const getParticipantAvatar = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.groupName?.charAt(0).toUpperCase() || 'G';
    }
    
    const currentUser = authService.getUser();
    const otherParticipant = chat.participants.find((p: User) => p._id !== currentUser?._id);
    return otherParticipant ? 
      `${otherParticipant.firstName.charAt(0)}${otherParticipant.lastName.charAt(0)}`.toUpperCase() : 
      'U';
  };

  const isParticipantOnline = (chat: Chat) => {
    if (chat.type === 'group') return false;
    
    const currentUser = authService.getUser();
    const otherParticipant = chat.participants.find((p: User) => p._id !== currentUser?._id);
    return otherParticipant?.isOnline || false;
  };

  const getMessageStatus = (message: Message) => {
    const currentUser = authService.getUser();
    if (message.sender._id !== currentUser?._id) return null;
    
    if (message.readBy && message.readBy.length > 0) {
      return <CheckCheck className="w-3 h-3 text-blue-400" />;
    }
    if (message.deliveredTo && message.deliveredTo.length > 0) {
      return <CheckCheck className="w-3 h-3 text-gray-400" />;
    }
    return <Check className="w-3 h-3 text-gray-400" />;
  };

  const filteredChats = state.chats.filter(chat =>
    getParticipantName(chat).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUser = authService.getUser();
  const typingUsersInCurrentChat = state.selectedChat ? 
    state.typingUsers.get(state.selectedChat._id) || [] : [];

  if (!authService.isAuthenticated()) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg"
        >
          <MessageCircle size={24} />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg relative"
          >
            <MessageCircle size={24} />
            {state.unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {state.unreadCount > 99 ? '99+' : state.unreadCount}
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-green-600 dark:bg-green-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {state.selectedChat && (
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="p-1 hover:bg-green-700 dark:hover:bg-green-600 rounded"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div>
                  <h3 className="font-semibold">
                    {state.selectedChat ? getParticipantName(state.selectedChat) : 'WhatsApp'}
                  </h3>
                  {state.selectedChat && (
                    <p className="text-xs text-green-100">
                      {isParticipantOnline(state.selectedChat) ? 'online' : 
                       state.selectedChat.participants.find(p => p._id !== currentUser?._id)?.lastSeen ?
                       `last seen ${formatLastSeen(state.selectedChat.participants.find(p => p._id !== currentUser?._id)!.lastSeen!)}` :
                       'offline'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {state.selectedChat && (
                  <>
                    <button 
                      onClick={handleVoiceCall}
                      className="p-2 hover:bg-green-700 dark:hover:bg-green-600 rounded"
                      title="Voice Call"
                    >
                      <Phone size={18} />
                    </button>
                    <button 
                      onClick={handleVideoCall}
                      className="p-2 hover:bg-green-700 dark:hover:bg-green-600 rounded"
                      title="Video Call"
                    >
                      <Video size={18} />
                    </button>
                    <button className="p-2 hover:bg-green-700 dark:hover:bg-green-600 rounded">
                      <MoreVertical size={18} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-green-700 dark:hover:bg-green-600 rounded"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Connection Status */}
            {!state.isConnected && (
              <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 text-sm text-center">
                Connecting...
              </div>
            )}

            <div className="flex-1 overflow-hidden">
              {!state.selectedChat ? (
                // Chat List
                <div className="h-full flex flex-col">
                  {/* Search */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-900">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search or start new chat"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Chat List */}
                  <div className="flex-1 overflow-y-auto">
                    {state.loading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      </div>
                    ) : filteredChats.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <div className="text-center">
                          <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                          <p>No conversations yet</p>
                          <p className="text-sm">Tap the new chat button to start messaging</p>
                        </div>
                      </div>
                    ) : (
                      filteredChats.map((chat) => (
                        <motion.div
                          key={chat._id}
                          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                          onClick={() => setSelectedChat(chat)}
                          className="p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
                                {getParticipantAvatar(chat)}
                              </div>
                              {isParticipantOnline(chat) && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
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
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {chat.lastMessage?.content || 'Tap to start messaging'}
                                </p>
                                {chat.unreadCount > 0 && (
                                  <div className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
              ) : (
                // Messages View
                <div className="h-full flex flex-col">
                  {/* Messages */}
                  <div 
                    className="flex-1 overflow-y-auto p-4 space-y-2 chat-messages" 
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5ddd5' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundColor: '#e5ddd5'
                    }}
                    data-messages-container
                  >
                    {state.messages.map((message) => {
                      const isOwn = message.sender._id === currentUser?._id;
                      return (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                        >
                          <div className={`max-w-xs px-3 py-2 rounded-lg shadow-sm relative ${
                            isOwn 
                              ? 'bg-green-500 text-white' 
                              : 'bg-white text-gray-900'
                          }`}
                          style={{
                            borderRadius: isOwn ? '7.5px 7.5px 7.5px 0px' : '7.5px 7.5px 0px 7.5px'
                          }}>
                            {message.replyTo && (
                              <div className={`mb-2 p-2 rounded border-l-4 text-xs ${
                                isOwn 
                                  ? 'bg-green-600 border-green-300' 
                                  : 'bg-gray-100 border-gray-400'
                              }`}>
                                <p className="font-medium opacity-80">{message.replyTo.sender.firstName}</p>
                                <p className="truncate opacity-70">{message.replyTo.content}</p>
                              </div>
                            )}
                            
                            {message.content && (
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            )}
                            
                            <div className="flex items-center justify-end mt-1 space-x-1">
                              <span className={`text-xs ${isOwn ? 'text-green-100' : 'text-gray-500'}`}>
                                {formatTime(message.createdAt)}
                              </span>
                              {isOwn && (
                                <div className="text-green-100">
                                  {getMessageStatus(message)}
                                </div>
                              )}
                            </div>
                            
                            {!isOwn && (
                              <button
                                onClick={() => setReplyingTo(message)}
                                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 bg-gray-200 hover:bg-gray-300 rounded transition-opacity"
                              >
                                <Reply size={12} />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                    
                    {/* Typing Indicator */}
                    {typingUsersInCurrentChat.length > 0 && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Reply Preview */}
                  {replyingTo && (
                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border-l-4 border-green-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-green-600 dark:text-green-400">
                            Replying to {replyingTo.sender.firstName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {replyingTo.content}
                          </p>
                        </div>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <Paperclip size={20} />
                      </button>
                      
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={handleInputChange}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message"
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                        />
                      </div>
                      
                      <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <Smile size={20} />
                      </button>
                      
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;