import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { authService } from '../../shared/services/auth.service';
import { Message, Call } from '../../shared/types';

interface SocketEvents {
  // Authentication
  authenticated: (data: { success: boolean; user: any }) => void;
  authError: (data: { message: string }) => void;

  // Messages
  newMessage: (message: Message) => void;
  messageDelivered: (data: { tempId: string; messageId: string; timestamp: Date }) => void;
  messageError: (data: { tempId: string; error: string }) => void;
  messagesRead: (data: { chatId: string; messageIds: string[]; readBy: string; readAt: Date }) => void;
  userTyping: (data: { userId: string; chatId: string; isTyping: boolean }) => void;

  // Calls
  incomingCall: (data: { call: Call; offer?: any }) => void;
  callInitiated: (data: { call: Call }) => void;
  callAnswered: (data: { call: Call }) => void;
  callDeclined: (data: { userId: string; callId: string }) => void;
  callEnded: (data: { callId: string; endedBy: string; call: Call }) => void;
  userJoinedCall: (data: { userId: string; answer?: any }) => void;

  // WebRTC
  iceCandidate: (data: { candidate: any; sender: string }) => void;
  offer: (data: { offer: any; sender: string }) => void;
  answer: (data: { answer: any; sender: string }) => void;

  // Presence
  presenceUpdate: (data: { userId: string; isOnline: boolean; lastSeen?: Date }) => void;

  // General
  error: (data: { message: string }) => void;
  disconnect: () => void;
  connect: () => void;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  on: <K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) => void;
  off: <K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) => void;
  emit: (event: string, data?: any) => void;
  // Socket utility methods
  sendMessage: (messageData: {
    chatId: string;
    content?: string;
    messageType?: string;
    replyTo?: string;
    tempId?: string;
  }) => void;
  markAsRead: (chatId: string, messageIds: string[]) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  initiateCall: (participantIds: string[], type: 'voice' | 'video', chatId?: string, offer?: any) => void;
  answerCall: (callId: string, answer?: any) => void;
  declineCall: (callId: string) => void;
  endCall: (callId: string) => void;
  sendIceCandidate: (callId: string, candidate: any) => void;
  sendOffer: (callId: string, offer: any) => void;
  sendAnswer: (callId: string, answer: any) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
  isAuthenticated: boolean;
  user: any;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ 
  children, 
  isAuthenticated, 
  user 
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [eventListeners] = useState<Map<string, Function[]>>(new Map());
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  // Use refs to prevent unnecessary re-connections
  const isConnectingRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);
  const lastUserIdRef = useRef<string | null>(null);
  
  const maxReconnectAttempts = 5;
  const reconnectDelay = 1000;

  const getSocketUrl = useCallback((): string => {
    const possibleUrls = [
      process.env.REACT_APP_SOCKET_URL,
      'http://localhost:5000',
    ];
    return possibleUrls.find(url => url && url.trim() !== '') || 'http://localhost:5000';
  }, []);

  const emitToListeners = useCallback((event: string, data?: any) => {
    const listeners = eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }, [eventListeners]);

  const setupSocketListeners = useCallback((socketInstance: Socket) => {
    // Remove any existing listeners first
    socketInstance.removeAllListeners();

    socketInstance.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setIsConnected(true);
      setReconnectAttempts(0);
      isConnectingRef.current = false;
      emitToListeners('connect');
      
      // Authenticate after connection
      const token = authService.getToken();
      if (token) {
        socketInstance.emit('authenticate', token);
      }
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.IO server:', reason);
      setIsConnected(false);
      isConnectingRef.current = false;
      emitToListeners('disconnect');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      isConnectingRef.current = false;
      setReconnectAttempts(prev => {
        const newAttempts = prev + 1;
        if (newAttempts >= maxReconnectAttempts) {
          console.log('Max reconnection attempts reached');
          emitToListeners('error', { message: 'Failed to connect to chat server. Please check your connection.' });
        }
        return newAttempts;
      });
    });

    // Authentication events
    socketInstance.on('authenticated', (data) => {
      console.log('Socket authenticated successfully');
      emitToListeners('authenticated', data);
    });

    socketInstance.on('authError', (data) => {
      console.error('Socket authentication error:', data);
      emitToListeners('authError', data);
    });

    // Message events
    socketInstance.on('newMessage', (message) => {
      emitToListeners('newMessage', message);
    });

    socketInstance.on('messageDelivered', (data) => {
      emitToListeners('messageDelivered', data);
    });

    socketInstance.on('messageError', (data) => {
      emitToListeners('messageError', data);
    });

    socketInstance.on('messagesRead', (data) => {
      emitToListeners('messagesRead', data);
    });

    socketInstance.on('userTyping', (data) => {
      emitToListeners('userTyping', data);
    });

    // Call events
    socketInstance.on('incomingCall', (data) => {
      emitToListeners('incomingCall', data);
    });

    socketInstance.on('callInitiated', (data) => {
      emitToListeners('callInitiated', data);
    });

    socketInstance.on('callAnswered', (data) => {
      emitToListeners('callAnswered', data);
    });

    socketInstance.on('callDeclined', (data) => {
      emitToListeners('callDeclined', data);
    });

    socketInstance.on('callEnded', (data) => {
      emitToListeners('callEnded', data);
    });

    socketInstance.on('userJoinedCall', (data) => {
      emitToListeners('userJoinedCall', data);
    });

    // WebRTC events
    socketInstance.on('iceCandidate', (data) => {
      emitToListeners('iceCandidate', data);
    });

    socketInstance.on('offer', (data) => {
      emitToListeners('offer', data);
    });

    socketInstance.on('answer', (data) => {
      emitToListeners('answer', data);
    });

    // Presence events
    socketInstance.on('presenceUpdate', (data) => {
      emitToListeners('presenceUpdate', data);
    });

    // General error handling
    socketInstance.on('error', (data) => {
      emitToListeners('error', data);
    });
  }, [emitToListeners, maxReconnectAttempts]);

  const connect = useCallback(() => {
    if (!isAuthenticated) {
      console.log('Not authenticated, skipping socket connection');
      return;
    }

    const currentToken = authService.getToken();
    const currentUserId = user?._id || user?.id;

    // Prevent multiple connection attempts
    if (isConnectingRef.current) {
      console.log('Socket connection already in progress');
      return;
    }

    // Check if we already have a valid connection with the same token and user
    if (socket?.connected && 
        lastTokenRef.current === currentToken && 
        lastUserIdRef.current === currentUserId) {
      console.log('Socket already connected with same credentials');
      return;
    }

    // Disconnect existing socket if credentials changed
    if (socket && (lastTokenRef.current !== currentToken || lastUserIdRef.current !== currentUserId)) {
      console.log('Credentials changed, disconnecting existing socket');
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }

    if (!currentToken) {
      console.log('No token available for socket connection');
      return;
    }

    isConnectingRef.current = true;
    lastTokenRef.current = currentToken;
    lastUserIdRef.current = currentUserId;

    const socketUrl = getSocketUrl();
    console.log('Attempting to connect to Socket.IO server at:', socketUrl);

    try {
      const newSocket = io(socketUrl, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: reconnectDelay,
        autoConnect: false,
        forceNew: true,
        query: {
          token: currentToken
        }
      });

      setupSocketListeners(newSocket);
      newSocket.connect();
      setSocket(newSocket);
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      isConnectingRef.current = false;
    }
  }, [isAuthenticated, user, socket, getSocketUrl, setupSocketListeners, maxReconnectAttempts, reconnectDelay]);

  const disconnect = useCallback(() => {
    if (socket) {
      console.log('Disconnecting socket');
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setReconnectAttempts(0);
      isConnectingRef.current = false;
      lastTokenRef.current = null;
      lastUserIdRef.current = null;
    }
  }, [socket]);

  const on = useCallback(<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) => {
    if (!eventListeners.has(event)) {
      eventListeners.set(event, []);
    }
    eventListeners.get(event)!.push(callback);
  }, [eventListeners]);

  const off = useCallback(<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) => {
    const listeners = eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }, [eventListeners]);

  const emit = useCallback((event: string, data?: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn(`Socket not connected. Cannot emit event: ${event}`);
    }
  }, [socket]);

  // Socket utility methods
  const sendMessage = useCallback((messageData: {
    chatId: string;
    content?: string;
    messageType?: string;
    replyTo?: string;
    tempId?: string;
  }) => {
    if (socket?.connected) {
      socket.emit('sendMessage', messageData);
    } else {
      console.warn('Socket not connected. Cannot send message.');
    }
  }, [socket]);

  const markAsRead = useCallback((chatId: string, messageIds: string[]) => {
    if (socket?.connected) {
      socket.emit('markAsRead', { chatId, messageIds });
    }
  }, [socket]);

  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    if (socket?.connected) {
      socket.emit('typing', { chatId, isTyping });
    }
  }, [socket]);

  const joinChat = useCallback((chatId: string) => {
    if (socket?.connected) {
      socket.emit('joinChat', chatId);
    }
  }, [socket]);

  const leaveChat = useCallback((chatId: string) => {
    if (socket?.connected) {
      socket.emit('leaveChat', chatId);
    }
  }, [socket]);

  const initiateCall = useCallback((participantIds: string[], type: 'voice' | 'video', chatId?: string, offer?: any) => {
    if (socket?.connected) {
      socket.emit('initiateCall', {
        participantIds,
        type,
        chatId,
        offer
      });
    }
  }, [socket]);

  const answerCall = useCallback((callId: string, answer?: any) => {
    if (socket?.connected) {
      socket.emit('answerCall', { callId, answer });
    }
  }, [socket]);

  const declineCall = useCallback((callId: string) => {
    if (socket?.connected) {
      socket.emit('declineCall', { callId });
    }
  }, [socket]);

  const endCall = useCallback((callId: string) => {
    if (socket?.connected) {
      socket.emit('endCall', { callId });
    }
  }, [socket]);

  const sendIceCandidate = useCallback((callId: string, candidate: any) => {
    if (socket?.connected) {
      socket.emit('iceCandidate', { callId, candidate });
    }
  }, [socket]);

  const sendOffer = useCallback((callId: string, offer: any) => {
    if (socket?.connected) {
      socket.emit('offer', { callId, offer });
    }
  }, [socket]);

  const sendAnswer = useCallback((callId: string, answer: any) => {
    if (socket?.connected) {
      socket.emit('answer', { callId, answer });
    }
  }, [socket]);

  // Connect when authenticated, disconnect when not
  // Use a more stable dependency array to prevent frequent re-connections
  useEffect(() => {
    const currentToken = authService.getToken();
    const currentUserId = user?._id || user?.id;
    
    if (isAuthenticated && user && currentToken) {
      // Only connect if we don't have a connection or credentials changed
      if (!socket?.connected || 
          lastTokenRef.current !== currentToken || 
          lastUserIdRef.current !== currentUserId) {
        connect();
      }
    } else {
      disconnect();
    }

    return () => {
      // Only disconnect on unmount, not on every effect run
      if (!isAuthenticated) {
        disconnect();
      }
    };
  }, [isAuthenticated, user?._id, user?.id]); // Stable dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const value: SocketContextType = {
    socket,
    isConnected,
    connect,
    disconnect,
    on,
    off,
    emit,
    sendMessage,
    markAsRead,
    sendTyping,
    joinChat,
    leaveChat,
    initiateCall,
    answerCall,
    declineCall,
    endCall,
    sendIceCandidate,
    sendOffer,
    sendAnswer,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};