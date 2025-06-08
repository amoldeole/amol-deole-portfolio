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
} from 'lucide-react';
import { chatService } from '../../../shared/services/chat.service';
import { Chat, Message } from '../../../shared/types';
import { authService } from '../../../shared/services/auth.service';
import { useSocket } from '../../../app/providers/SocketContext';
import { useNavigate } from 'react-router-dom';

// Extended Message type for local state management
interface LocalMessage extends Message {
  tempId?: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const currentUser = authService.getUser();
  const navigate = useNavigate();

  // Use SocketContext instead of socketService
  const { 
    isConnected, 
    on, 
    off, 
    sendMessage: socketSendMessage, 
    sendTyping, 
    joinChat, 
    leaveChat 
  } = useSocket();

  // Auth check
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadChats();
  }, [isAuthenticated]);

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat._id);
      // Join the chat room when selecting a chat
      joinChat(selectedChat._id);
    }
    
    // Leave previous chat when switching
    return () => {
      if (selectedChat) {
        leaveChat(selectedChat._id);
      }
    };
  }, [selectedChat, joinChat, leaveChat]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Typing indicator logic
  useEffect(() => {
    if (selectedChat && isTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        sendTyping(selectedChat._id, false);
      }, 1000);
    }
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [isTyping, selectedChat, sendTyping]);

  // --- SOCKET LISTENERS: Always active ---
  useEffect(() => {
    // Typing: only update if relevant chat is open
    const handleTyping = (data: { chatId: string; isTyping: boolean; userId: string }) => {
      if (selectedChat && data.chatId === selectedChat._id && data.userId !== currentUser?._id) {
        setOtherUserTyping(data.isTyping);
      }
    };

    // New message: always update unread count and show notification
    const handleNewMessage = (message: Message) => {
      console.log('New message received:', message);
      
      // Check if message already exists to prevent duplicates
      setMessages(prev => {
        const existingMessage = prev.find(msg => msg._id === message._id);
        if (existingMessage) {
          console.log('Message already exists, skipping duplicate');
          return prev;
        }
        
        // If the selected chat is open, add message to messages
        if (selectedChat && message.chatId === selectedChat._id) {
          return [...prev, message];
        }
        return prev;
      });
      
      // Always update unread count for the relevant chat
      setChats(prevChats =>
        prevChats.map(chat =>
          chat._id === message.chatId
            ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1, lastMessage: message }
            : chat
        )
      );
      
      // Show toast if the message is for a chat that's not currently open
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

    const handleMessageDelivered = (data: { tempId: string; messageId: string; timestamp: Date }) => {
      console.log('Message delivered:', data);
      // Update message status in the UI if needed
      setMessages(prev => 
        prev.map(msg => {
          if (msg.tempId === data.tempId) {
            return { 
              ...msg, 
              _id: data.messageId, 
              deliveredTo: [...(msg.deliveredTo || []), currentUser?._id!],
              tempId: undefined // Remove tempId once message is delivered
            } as LocalMessage;
          }
          return msg;
        })
      );
    };

    const handleMessageError = (data: { tempId: string; error: string }) => {
      console.error('Message error:', data);
      // Remove the failed message from UI or mark it as failed
      setMessages(prev => 
        prev.filter(msg => msg.tempId !== data.tempId)
      );
      
      // Handle message send error - maybe show retry option
      window.dispatchEvent(
        new CustomEvent('toast', {
          detail: {
            type: 'error',
            message: `Failed to send message: ${data.error}`,
          },
        })
      );
    };

    const handleMessagesRead = (data: { chatId: string; messageIds: string[]; readBy: string; readAt: Date }) => {
      console.log('Messages read:', data);
      // Update read status for messages
      if (selectedChat && data.chatId === selectedChat._id) {
        setMessages(prev =>
          prev.map(msg => {
            if (data.messageIds.includes(msg._id)) {
              return {
                ...msg,
                readBy: [...(msg.readBy || []), data.readBy]
              } as LocalMessage;
            }
            return msg;
          })
        );
      }
    };

    // Register event listeners
    on('userTyping', handleTyping);
    on('newMessage', handleNewMessage);
    on('messageDelivered', handleMessageDelivered);
    on('messageError', handleMessageError);
    on('messagesRead', handleMessagesRead);

    return () => {
      // Cleanup event listeners
      off('userTyping', handleTyping);
      off('newMessage', handleNewMessage);
      off('messageDelivered', handleMessageDelivered);
      off('messageError', handleMessageError);
      off('messagesRead', handleMessagesRead);
    };
  }, [selectedChat, currentUser, on, off]);

  // --- Data Loaders ---
  const loadChats = async () => {
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
  };

  const loadMessages = async (chatId: string) => {
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
  };

  // --- Input & Send ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      if (selectedChat) sendTyping(selectedChat._id, true);
    } else if (isTyping && !e.target.value.trim()) {
      setIsTyping(false);
      if (selectedChat) sendTyping(selectedChat._id, false);
    }
  };

  const sendMessageHandler = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      // Generate a temporary ID for optimistic updates
      const tempId = `temp_${Date.now()}_${Math.random()}`;
      
      // Optimistically add message to UI
      const optimisticMessage: LocalMessage = {
        _id: tempId,
        tempId,
        chatId: selectedChat._id,
        sender: {
          ...currentUser!,
          lastSeen: currentUser?.lastSeen ? new Date(currentUser.lastSeen) : undefined
        },
        content: newMessage.trim(),
        messageType: 'text',
        createdAt: new Date(),
        updatedAt: new Date(),
        replyTo: replyingTo ? {
          _id: replyingTo._id,
          content: replyingTo.content || '',
          sender: {
            ...replyingTo.sender,
            lastSeen: replyingTo.sender.lastSeen ? new Date(replyingTo.sender.lastSeen) : undefined
          }
        } : undefined,
        deliveredTo: [],
        readBy: [],
        isDeleted: false
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      
      // Send via socket
      socketSendMessage({
        chatId: selectedChat._id,
        content: newMessage.trim(),
        replyTo: replyingTo?._id,
        tempId
      });
      
      setNewMessage('');
      setReplyingTo(null);
      setIsTyping(false);
      sendTyping(selectedChat._id, false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };  const handleKeyPress = (e: React.KeyboardEvent) => {    if (e.key === 'Enter') {      e.preventDefault();
      sendMessageHandler();
    }
  };

  // --- Helpers ---
  const formatTime = (date: Date | string) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
    if (chat.type === 'group') return chat.groupName || 'Group Chat';
    const other = chat.participants.find(p => p._id !== currentUser?._id);
    return other ? `${other.firstName} ${other.lastName}` : 'Unknown';
  };

  const getParticipantAvatar = (chat: Chat) => {
    if (chat.type === 'group') return chat.groupName?.charAt(0).toUpperCase() || 'G';
    const other = chat.participants.find(p => p._id !== currentUser?._id);
    return other
      ? `${other.firstName.charAt(0)}${other.lastName.charAt(0)}`.toUpperCase()
      : 'U';
  };

  const isParticipantOnline = (chat: Chat) => {
    if (chat.type === 'group') return false;
    const other = chat.participants.find(p => p._id !== currentUser?._id);
    return other?.isOnline || false;
  };

  const getMessageStatus = (message: LocalMessage) => {
    if (message.sender._id !== currentUser?._id) return null;
    if (message.readBy && message.readBy.length > 0) {
      return <CheckCheck className="w-3 h-3 text-blue-400" />;
    }
    if (message.deliveredTo && message.deliveredTo.length > 0) {
      return <CheckCheck className="w-3 h-3 text-gray-400" />;
    }
    return <Check className="w-3 h-3 text-gray-400" />;
  };

  const filteredChats = chats.filter(chat =>
    getParticipantName(chat).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate unique key for messages
  const getMessageKey = (message: LocalMessage) => {
    return message.tempId || message._id;
  };

  // --- UI ---
  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/signup')}
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
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/signup');
              } else {
                setIsOpen(true);
              }
            }}
            className={`p-4 rounded-full shadow-lg relative ${
              isConnected 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gray-500 hover:bg-gray-600'
            } text-white`}
          >
            <MessageCircle size={24} />
            {/* Connection status indicator */}
            <div className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              isConnected ? 'bg-green-400' : 'bg-red-400'
            }`} />
            {/* Badge for total unread messages */}
            {chats.reduce((count, chat) => count + (chat.unreadCount || 0), 0) > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {chats.reduce((count, chat) => count + (chat.unreadCount || 0), 0) > 99
                  ? '99+'
                  : chats.reduce((count, chat) => count + (chat.unreadCount || 0), 0)}
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
                {selectedChat && (
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="p-1 hover:bg-green-700 dark:hover:bg-green-600 rounded"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div>
                  <h3 className="font-semibold">
                    {selectedChat ? getParticipantName(selectedChat) : 'WhatsApp'}
                  </h3>
                  {selectedChat && (
                    <p className="text-xs text-green-100">
                      {isParticipantOnline(selectedChat) ? 'online' :
                        selectedChat.participants.find(p => p._id !== currentUser?._id)?.lastSeen ?
                          `last seen ${formatLastSeen(selectedChat.participants.find(p => p._id !== currentUser?._id)!.lastSeen!)}` :
                          'offline'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Connection status indicator */}
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-300'}`} 
                     title={isConnected ? 'Connected' : 'Disconnected'} />
                
                {selectedChat && (
                  <>
                    <button
                      onClick={() => {/* handle audio call */}}
                      className="p-2 hover:bg-green-700 dark:hover:bg-green-600 rounded"
                      title="Audio Call"
                    >
                      <Phone size={18} />
                    </button>
                    <button
                      onClick={() => {/* handle video call */}}
                      className="p-2 hover:bg-green-700 dark:hover:bg-green-600 rounded"
                      title="Video Call"
                    >
                      <Video size={18} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-green-700 dark:hover:bg-green-600 rounded"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {!selectedChat ? (
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
                    {loading ? (
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
                                  <div className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
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
                    {messages.map((message) => {
                      const isOwn = message.sender._id === currentUser?._id;
                      return (
                        <motion.div
                          key={getMessageKey(message)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                        >
                          <div className={`max-w-xs px-3 py-2 rounded-lg shadow-sm relative ${
                            isOwn
                              ? 'bg-green-500 text-white'
                              : 'bg-white text-gray-900'
                            } ${message.tempId ? 'opacity-70' : ''}`}
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

                            {message.media && message.media.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.media.map((file) => (
                                  <div key={file._id}>
                                    {file.mimetype.startsWith('image/') ? (
                                      <img
                                        src={file.url}
                                        alt={file.originalName}
                                        className="max-w-full h-auto rounded"
                                      />
                                    ) : (
                                      <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-xs underline"
                                      >
                                        <Paperclip size={12} />
                                        <span>{file.originalName}</span>
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
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

                    {/* Typing Indicator for other user */}
                    {otherUserTyping && (
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
                          placeholder={isConnected ? "Type a message" : "Connecting..."}
                          disabled={!isConnected}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <Smile size={20} />
                      </button>

                      <button
                        onClick={sendMessageHandler}
                        disabled={!newMessage.trim() || !isConnected}
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