import { io, Socket } from 'socket.io-client';
import { authService } from './auth.service';
import { Message, Call } from '../types';

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

class SocketService {
  private socket: Socket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  private getSocketUrl(): string {
    // Try multiple possible backend URLs
    const possibleUrls = [
      process.env.REACT_APP_SOCKET_URL,
      process.env.REACT_APP_API_URL,
      process.env.REACT_APP_BACKEND_API_URL,
      'http://localhost:5000', // Alternative port
      'http://localhost:8000'  // Another common port
    ];

    // Return the first non-undefined URL
    return possibleUrls.find(url => url && url.trim() !== '') || 'http://localhost:5000';
  }

  private initializeSocket() {
    const socketUrl = this.getSocketUrl();
    console.log('Attempting to connect to Socket.IO server at:', socketUrl);

    try {
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'], // Allow fallback to polling
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        autoConnect: false, // We'll connect manually after auth
        forceNew: true,
        query: {
          // Use authService to get token consistently
          token: authService.getToken() || ''
        }
      });

      this.setupSocketListeners();
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      this.reconnectAttempts = 0;
      this.emit('connect');
      
      // Authenticate after connection using authService
      const token = authService.getToken();
      if (token) {
        this.socket?.emit('authenticate', token);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.IO server:', reason);
      this.emit('disconnect');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log('Max reconnection attempts reached');
        this.emit('error', { message: 'Failed to connect to chat server. Please check your connection.' });
      }
    });

    // Authentication events
    this.socket.on('authenticated', (data) => {
      console.log('Socket authenticated successfully');
      this.emit('authenticated', data);
    });

    this.socket.on('authError', (data) => {
      console.error('Socket authentication error:', data);
      this.emit('authError', data);
    });

    // Message events
    this.socket.on('newMessage', (message) => {
      this.emit('newMessage', message);
    });

    this.socket.on('messageDelivered', (data) => {
      this.emit('messageDelivered', data);
    });

    this.socket.on('messageError', (data) => {
      this.emit('messageError', data);
    });

    this.socket.on('messagesRead', (data) => {
      this.emit('messagesRead', data);
    });

    this.socket.on('userTyping', (data) => {
      this.emit('userTyping', data);
    });

    // Call events
    this.socket.on('incomingCall', (data) => {
      this.emit('incomingCall', data);
    });

    this.socket.on('callInitiated', (data) => {
      this.emit('callInitiated', data);
    });

    this.socket.on('callAnswered', (data) => {
      this.emit('callAnswered', data);
    });

    this.socket.on('callDeclined', (data) => {
      this.emit('callDeclined', data);
    });

    this.socket.on('callEnded', (data) => {
      this.emit('callEnded', data);
    });

    this.socket.on('userJoinedCall', (data) => {
      this.emit('userJoinedCall', data);
    });

    // WebRTC events
    this.socket.on('iceCandidate', (data) => {
      this.emit('iceCandidate', data);
    });

    this.socket.on('offer', (data) => {
      this.emit('offer', data);
    });

    this.socket.on('answer', (data) => {
      this.emit('answer', data);
    });

    // Presence events
    this.socket.on('presenceUpdate', (data) => {
      this.emit('presenceUpdate', data);
    });

    // General error handling
    this.socket.on('error', (data) => {
      this.emit('error', data);
    });
  }

  connect() {
    if (!this.socket || !this.socket.connected) {
      this.initializeSocket();
    }
    
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Event management
  on<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Message methods
  sendMessage(messageData: {
    chatId: string;
    content?: string;
    messageType?: string;
    replyTo?: string;
    tempId?: string;
  }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('sendMessage', messageData);
    } else {
      console.warn('Socket not connected. Cannot send message.');
    }
  }

  markAsRead(chatId: string, messageIds: string[]) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('markAsRead', { chatId, messageIds });
    }
  }

  sendTyping(chatId: string, isTyping: boolean) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('typing', { chatId, isTyping });
    }
  }

  // Chat room methods
  joinChat(chatId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('joinChat', chatId);
    }
  }

  leaveChat(chatId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('leaveChat', chatId);
    }
  }

  // Call methods
  initiateCall(participantIds: string[], type: 'voice' | 'video', chatId?: string, offer?: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('initiateCall', {
        participantIds,
        type,
        chatId,
        offer
      });
    }
  }

  answerCall(callId: string, answer?: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('answerCall', { callId, answer });
    }
  }

  declineCall(callId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('declineCall', { callId });
    }
  }

  endCall(callId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('endCall', { callId });
    }
  }

  // WebRTC methods
  sendIceCandidate(callId: string, candidate: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('iceCandidate', { callId, candidate });
    }
  }

  sendOffer(callId: string, offer: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('offer', { callId, offer });
    }
  }

  sendAnswer(callId: string, answer: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('answer', { callId, answer });
    }
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();