import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Phone, Video, Paperclip, Smile, MoreVertical } from 'lucide-react';
import { chatService } from '../../services/chat.service';
import { authService } from '../../services/auth.service';
import { Chat, Message } from '../../types/chat';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is authenticated
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      loadChats();
    }
  }, [isAuthenticated, isOpen]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChats = async () => {
    try {
      setLoading(true);
      const response = await chatService.getUserChats();
      // Fix: Extract chats from the paginated response
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
      // Fix: Extract messages from the paginated response
      const messagesData = response.data?.messages || response.data?.items || [];
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Replace the sendMessage function with this corrected version:
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await chatService.sendMessage(selectedChat._id, newMessage.trim());
      // Fix: Properly extract the message from the API response
      const messageData = response.data as Message; // Type assertion to ensure it's a Message
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');

      // Update chat's last message
      setChats(prev => prev.map(chat =>
        chat._id === selectedChat._id
          ? { ...chat, lastMessage: messageData }
          : chat
      ));
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getParticipantName = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.groupName || 'Group Chat';
    }

    const currentUser = authService.getUser();
    const otherParticipant = chat.participants.find(p => p._id !== currentUser?._id);
    return otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Unknown';
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <MessageCircle size={24} />
        </button>

        {isOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="p-4 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Please log in to use the chat feature
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {selectedChat ? getParticipantName(selectedChat) : 'Messages'}
            </h3>
            <div className="flex items-center space-x-2">
              {selectedChat && (
                <>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <Phone size={16} />
                  </button>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <Video size={16} />
                  </button>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <MoreVertical size={16} />
                  </button>
                </>
              )}
              {selectedChat && (
                <button
                  onClick={() => setSelectedChat(null)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  ←
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {!selectedChat ? (
              // Chat List
              <div className="h-full overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : chats.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No conversations yet</p>
                      <p className="text-sm">Start a new chat to begin messaging</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {chats.map((chat) => (
                      <div
                        key={chat._id}
                        onClick={() => setSelectedChat(chat)}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {getParticipantName(chat).charAt(0).toUpperCase()}
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
                            {chat.lastMessage && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {chat.lastMessage.content || 'Media message'}
                              </p>
                            )}
                          </div>
                          {chat.unreadCount > 0 && (
                            <div className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {chat.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Messages View
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" data-messages-container>
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const currentUser = authService.getUser();
                      const isOwn = message.sender._id === currentUser?._id;

                      return (
                        <div
                          key={message._id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                              }`}
                          >
                            {!isOwn && selectedChat?.type === 'group' && (
                              <p className="text-xs font-semibold mb-1">
                                {message.sender.firstName} {message.sender.lastName}
                              </p>
                            )}

                            {message.replyTo && (
                              <div className="bg-black bg-opacity-20 rounded p-2 mb-2 text-xs">
                                <p className="opacity-75">Replying to:</p>
                                <p className="truncate">{message.replyTo.content}</p>
                              </div>
                            )}

                            {message.content && (
                              <p className="text-sm">{message.content}</p>
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

                            <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Paperclip size={16} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Smile size={16} />
                    </button>
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                        rows={1}
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;