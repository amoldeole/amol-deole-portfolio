import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { chatService } from '../../shared/services/chat.service';
import { authService } from '../../shared/services/auth.service';
import { useSocket } from './SocketContext';
import { Chat, ChatNotification, Message } from '../../shared/types';

// Extend Message interface to include tempId
interface ExtendedMessage extends Message {
  tempId?: string;
}

interface ChatState {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: ExtendedMessage[];
  notifications: ChatNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  typingUsers: Map<string, string[]>;
  totalUnreadCount: number;
}

type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CHATS'; payload: Chat[] }
  | { type: 'SET_SELECTED_CHAT'; payload: Chat | null }
  | { type: 'SET_MESSAGES'; payload: ExtendedMessage[] }
  | { type: 'ADD_MESSAGE'; payload: ExtendedMessage }
  | { type: 'UPDATE_MESSAGE'; payload: ExtendedMessage }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'SET_NOTIFICATIONS'; payload: ChatNotification[] }
  | { type: 'ADD_NOTIFICATION'; payload: ChatNotification }
  | { type: 'MARK_NOTIFICATIONS_READ'; payload: string[] }
  | { type: 'UPDATE_CHAT'; payload: Chat }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_TYPING'; payload: { chatId: string; userId: string; isTyping: boolean } }
  | { type: 'MARK_CHAT_READ'; payload: string }
  | { type: 'UPDATE_TOTAL_UNREAD' };

const initialState: ChatState = {
  chats: [],
  selectedChat: null,
  messages: [],
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  isConnected: false,
  typingUsers: new Map(),
  totalUnreadCount: 0,
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CHATS':
      const totalUnread = action.payload.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
      return { ...state, chats: action.payload, totalUnreadCount: totalUnread };
    case 'SET_SELECTED_CHAT':
      return { ...state, selectedChat: action.payload, messages: [] };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      // Prevent duplicate messages
      const messageExists = state.messages.some(msg => 
        msg._id === action.payload._id || 
        (action.payload.tempId && msg.tempId === action.payload.tempId)
      );
      if (messageExists) return state;

      // Update chat with new message and unread count
      const updatedChats = state.chats.map(chat => {
        if (chat._id === action.payload.chatId) {
          const isCurrentChat = state.selectedChat?._id === chat._id;
          const newUnreadCount = isCurrentChat ? 0 : (chat.unreadCount || 0) + 1;
          return {
            ...chat,
            lastMessage: action.payload,
            unreadCount: newUnreadCount,
            updatedAt: action.payload.createdAt
          };
        }
        return chat;
      });

      const newTotalUnread = updatedChats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);

      return { 
        ...state, 
        messages: [...state.messages, action.payload],
        chats: updatedChats,
        totalUnreadCount: newTotalUnread
      };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg._id === action.payload._id ? action.payload : msg
        ),
      };
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(msg => msg._id !== action.payload),
      };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.filter(
          notif => !action.payload.includes(notif._id)
        ),
      };
    case 'UPDATE_CHAT':
      const chatsAfterUpdate = state.chats.map(chat =>
        chat._id === action.payload._id ? action.payload : chat
      );
      const totalAfterUpdate = chatsAfterUpdate.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
      return {
        ...state,
        chats: chatsAfterUpdate,
        totalUnreadCount: totalAfterUpdate
      };
    case 'MARK_CHAT_READ':
      const chatsAfterRead = state.chats.map(chat =>
        chat._id === action.payload ? { ...chat, unreadCount: 0 } : chat
      );
      const totalAfterRead = chatsAfterRead.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
      return {
        ...state,
        chats: chatsAfterRead,
        totalUnreadCount: totalAfterRead
      };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_TYPING':
      const newTypingUsers = new Map(state.typingUsers);
      const { chatId, userId, isTyping } = action.payload;
      
      if (!newTypingUsers.has(chatId)) {
        newTypingUsers.set(chatId, []);
      }
      
      const typingList = newTypingUsers.get(chatId)!;
      if (isTyping && !typingList.includes(userId)) {
        typingList.push(userId);
      } else if (!isTyping) {
        const index = typingList.indexOf(userId);
        if (index > -1) {
          typingList.splice(index, 1);
        }
      }
      
      return { ...state, typingUsers: newTypingUsers };
    case 'UPDATE_TOTAL_UNREAD':
      const total = state.chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
      return { ...state, totalUnreadCount: total };
    default:
      return state;
  }
};

interface ChatContextType {
  state: ChatState;
  loadChats: () => Promise<void>;
  selectChat: (chat: Chat | null) => void;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, content: string, files?: File[], replyTo?: string) => Promise<void>;
  deleteMessage: (messageId: string, deleteForEveryone?: boolean) => Promise<void>;
  loadNotifications: () => Promise<void>;
  sendTyping: (chatId: string, isTyping: boolean) => void;
  markAsRead: (chatId: string, messageIds: string[]) => void;
  markChatAsRead: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const socket = useSocket();

  // Global message listener for toast notifications
  useEffect(() => {
    if (!socket) return;

    const handleGlobalNewMessage = (message: ExtendedMessage) => {
      // Always add message to context
      dispatch({ type: 'ADD_MESSAGE', payload: message });

      // Show toast notification if chat is not selected or widget is not open
      const isCurrentChat = state.selectedChat?._id === message.chatId;
      const isWidgetOpen = document.querySelector('[data-chat-widget-open]');
      const isChatHomeOpen = window.location.pathname.includes('/admin/chat-home');

      if (!isCurrentChat && !isWidgetOpen && !isChatHomeOpen) {
        // Dispatch global toast event
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

    socket.on('newMessage', handleGlobalNewMessage);

    return () => {
      socket.off('newMessage', handleGlobalNewMessage);
    };
  }, [socket, state.selectedChat]);

  const setupSocketListeners = useCallback(() => {
    if (!socket) return;

    // Connection events
    socket.on('connect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: true });
    });

    socket.on('disconnect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: false });
    });

    socket.on('authenticated', (data) => {
      console.log('Chat authenticated:', data);
    });

    socket.on('authError', (data) => {
      dispatch({ type: 'SET_ERROR', payload: data.message });
    });

    socket.on('messageDelivered', (data) => {
      console.log('Message delivered:', data);
    });

    socket.on('messageError', (data) => {
      dispatch({ type: 'SET_ERROR', payload: data.error });
    });

    socket.on('messagesRead', (data) => {
      console.log('Messages read:', data);
    });

    // Typing events
    socket.on('userTyping', (data) => {
      dispatch({ 
        type: 'SET_TYPING', 
        payload: { 
          chatId: data.chatId, 
          userId: data.userId, 
          isTyping: data.isTyping 
        } 
      });
    });

    // Presence events
    socket.on('presenceUpdate', (data) => {
      console.log('Presence update:', data);
    });

    // Error events
    socket.on('error', (data) => {
      dispatch({ type: 'SET_ERROR', payload: data.message });
    });
  }, [socket]);

  const cleanupSocketListeners = useCallback(() => {
    if (!socket) return;

    socket.off('connect', () => {});
    socket.off('disconnect', () => {});
    socket.off('authenticated', () => {});
    socket.off('authError', () => {});
    socket.off('messageDelivered', () => {});
    socket.off('messageError', () => {});
    socket.off('messagesRead', () => {});
    socket.off('userTyping', () => {});
    socket.off('presenceUpdate', () => {});
    socket.off('error', () => {});
  }, [socket]);

  // Memoize loadChats to prevent infinite loops
  const loadChats = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      dispatch({ type: 'SET_ERROR', payload: 'Not authenticated' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const response = await chatService.getUserChats();
      dispatch({ type: 'SET_CHATS', payload: response.data?.chats || response.data?.items || [] });
    } catch (error) {
      console.error('Failed to load chats:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load chats' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Memoize loadNotifications to prevent infinite loops
  const loadNotifications = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      dispatch({ type: 'SET_ERROR', payload: 'Not authenticated' });
      return;
    }

    try {
      const response = await chatService.getNotifications();
      dispatch({ type: 'SET_NOTIFICATIONS', payload: response.data?.notifications || response.data?.items || [] });
    } catch (error) {
      console.error('Failed to load notifications:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load notifications' });
    }
  }, []);

  // Only initialize once when authenticated
  useEffect(() => {
    if (authService.isAuthenticated() && socket) {
      setupSocketListeners();
      loadChats();
      loadNotifications();
    }

    return cleanupSocketListeners;
  }, [setupSocketListeners, cleanupSocketListeners, loadChats, loadNotifications, socket]);

  // Add this function before you use it in useCallback/selectChat
  const loadMessages = useCallback(async (chatId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await chatService.getChatMessages(chatId);
      const messagesData = response.data?.messages || response.data?.items || [];
      dispatch({ type: 'SET_MESSAGES', payload: messagesData });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load messages' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const selectChat = useCallback((chat: Chat | null) => {
    dispatch({ type: 'SET_SELECTED_CHAT', payload: chat });
    if (chat && socket) {
      socket.joinChat(chat._id);
      loadMessages(chat._id);
      // Mark chat as read when selected
      dispatch({ type: 'MARK_CHAT_READ', payload: chat._id });
    }
  }, [loadMessages, socket]);

  // Updated sendMessage function to handle reply functionality
  const sendMessage = useCallback(async (chatId: string, content: string, files?: File[], replyTo?: string) => {
    try {
      const tempId = `temp_${Date.now()}_${Math.random()}`;
      
      if (socket) {
        socket.sendMessage({
          chatId,
          content,
          tempId,
          messageType: files && files.length > 0 ? 'media' : 'text',
          replyTo
        });
      }

      // Use the updated chatService.sendMessage method that handles files and replies properly
      await chatService.sendMessage(chatId, content, files, replyTo);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to send message' });
    }
  }, [socket]);

  const deleteMessage = useCallback(async (messageId: string, deleteForEveryone: boolean = false) => {
    try {
      await chatService.deleteMessage(messageId, deleteForEveryone);
      dispatch({ type: 'DELETE_MESSAGE', payload: messageId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete message' });
    }
  }, []);

  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    if (socket) {
      socket.sendTyping(chatId, isTyping);
    }
  }, [socket]);

  const markAsRead = useCallback((chatId: string, messageIds: string[]) => {
    if (socket) {
      socket.markAsRead(chatId, messageIds);
    }
  }, [socket]);

  const markChatAsRead = useCallback((chatId: string) => {
    dispatch({ type: 'MARK_CHAT_READ', payload: chatId });
  }, []);

  const value: ChatContextType = {
    state,
    loadChats,
    selectChat,
    loadMessages,
    sendMessage,
    deleteMessage,
    loadNotifications,
    sendTyping,
    markAsRead,
    markChatAsRead,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};