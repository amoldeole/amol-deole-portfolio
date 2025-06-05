import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Chat, Message, ChatNotification } from '../types/chat';
import { chatService } from '../services/chat.service';
import { socketService } from '../services/socket.service';
import { authService } from '../services/auth.service';

interface ChatState {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  notifications: ChatNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  typingUsers: Map<string, string[]>; // chatId -> userIds
}

type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CHATS'; payload: Chat[] }
  | { type: 'SET_SELECTED_CHAT'; payload: Chat | null }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: Message }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'SET_NOTIFICATIONS'; payload: ChatNotification[] }
  | { type: 'ADD_NOTIFICATION'; payload: ChatNotification }
  | { type: 'MARK_NOTIFICATIONS_READ'; payload: string[] }
  | { type: 'UPDATE_CHAT'; payload: Chat }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_TYPING'; payload: { chatId: string; userId: string; isTyping: boolean } };

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
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CHATS':
      return { ...state, chats: action.payload };
    case 'SET_SELECTED_CHAT':
      return { ...state, selectedChat: action.payload, messages: [] };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { 
        ...state, 
        messages: [...state.messages, action.payload],
        chats: state.chats.map(chat => 
          chat._id === action.payload.chatId 
            ? { ...chat, lastMessage: action.payload, unreadCount: chat._id === state.selectedChat?._id ? 0 : chat.unreadCount + 1 }
            : chat
        )
      };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg._id === action.payload._id ? action.payload : msg
        )
      };
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(msg => msg._id !== action.payload)
      };
    case 'SET_NOTIFICATIONS':
      return { 
        ...state, 
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.isRead).length
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    case 'MARK_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          action.payload.includes(n._id) ? { ...n, isRead: true } : n
        ),
        unreadCount: state.notifications.filter(n => 
          !action.payload.includes(n._id) && !n.isRead
        ).length
      };
    case 'UPDATE_CHAT':
      return {
        ...state,
        chats: state.chats.map(chat => 
          chat._id === action.payload._id ? action.payload : chat
        )
      };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_TYPING':
      const newTypingUsers = new Map(state.typingUsers);
      const chatTypingUsers = newTypingUsers.get(action.payload.chatId) || [];
      
      if (action.payload.isTyping) {
        if (!chatTypingUsers.includes(action.payload.userId)) {
          newTypingUsers.set(action.payload.chatId, [...chatTypingUsers, action.payload.userId]);
        }
      } else {
        newTypingUsers.set(
          action.payload.chatId, 
          chatTypingUsers.filter(id => id !== action.payload.userId)
        );
      }
      
      return { ...state, typingUsers: newTypingUsers };
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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const setupSocketListeners = useCallback(() => {
    // Connection events
    socketService.on('connect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: true });
    });

    socketService.on('disconnect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: false });
    });

    socketService.on('authenticated', (data) => {
      console.log('Chat authenticated:', data);
    });

    socketService.on('authError', (data) => {
      dispatch({ type: 'SET_ERROR', payload: data.message });
    });

    // Message events
    socketService.on('newMessage', (message) => {
      dispatch({ type: 'ADD_MESSAGE', payload: message });
      
      // Auto-scroll to bottom if chat is selected
      setTimeout(() => {
        const messagesContainer = document.querySelector('[data-messages-container]');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    });

    socketService.on('messageDelivered', (data) => {
      console.log('Message delivered:', data);
    });

    socketService.on('messageError', (data) => {
      dispatch({ type: 'SET_ERROR', payload: data.error });
    });

    socketService.on('messagesRead', (data) => {
      console.log('Messages read:', data);
    });

    // Typing events
    socketService.on('userTyping', (data) => {
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
    socketService.on('presenceUpdate', (data) => {
      console.log('Presence update:', data);
    });

    // Error events
    socketService.on('error', (data) => {
      dispatch({ type: 'SET_ERROR', payload: data.message });
    });
  }, []);

  const cleanupSocketListeners = useCallback(() => {
    socketService.disconnect();
  }, []);

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
    if (authService.isAuthenticated()) {
      socketService.connect();
      setupSocketListeners();
      loadChats();
      loadNotifications();
    }

    return cleanupSocketListeners;
  }, [setupSocketListeners, cleanupSocketListeners, loadChats, loadNotifications]);

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
    if (chat) {
      socketService.joinChat(chat._id);
      loadMessages(chat._id);

      // Mark chat as read
      const updatedChat = { ...chat, unreadCount: 0 };
      dispatch({ type: 'UPDATE_CHAT', payload: updatedChat });
    }
  }, [loadMessages]);

  // Updated sendMessage function to handle reply functionality
  const sendMessage = useCallback(async (chatId: string, content: string, files?: File[], replyTo?: string) => {
    try {
      const tempId = `temp_${Date.now()}_${Math.random()}`;
      
      socketService.sendMessage({
        chatId,
        content,
        tempId,
        messageType: files && files.length > 0 ? 'media' : 'text',
        replyTo
      });

      // Use the updated chatService.sendMessage method that handles files and replies properly
      await chatService.sendMessage(chatId, content, files, replyTo);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to send message' });
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string, deleteForEveryone: boolean = false) => {
    try {
      await chatService.deleteMessage(messageId, deleteForEveryone);
      dispatch({ type: 'DELETE_MESSAGE', payload: messageId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete message' });
    }
  }, []);

  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    socketService.sendTyping(chatId, isTyping);
  }, []);

  const markAsRead = useCallback((chatId: string, messageIds: string[]) => {
    socketService.markAsRead(chatId, messageIds);
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
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        loadChats,
        selectChat,
        loadMessages, // Now this is defined
        sendMessage,
        deleteMessage,
        loadNotifications,
        sendTyping,
        markAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Export types for use in other components
export type { Message, Chat, ChatNotification };