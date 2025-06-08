import { authService } from './auth.service';
import { ApiResponse, PaginatedResponse, Chat, CreateChatRequest, Message, SendMessageRequest, ChatNotification, Call } from '../types';

class ChatService {
  private baseUrl = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:5000';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, clear it
        authService.logout();
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Chat methods
  async getUserChats(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Chat>>> {
    return this.request<PaginatedResponse<Chat>>(`/chat?page=${page}&limit=${limit}`);
  }

  async createIndividualChat(participantId: string): Promise<ApiResponse<Chat>> {
    const chatData: CreateChatRequest = {
      participantId,
      type: 'individual'
    };

    return this.request<Chat>('/chat/individual', {
      method: 'POST',
      body: JSON.stringify(chatData),
    });
  }

  async createGroupChat(
    participantIds: string[],
    groupName: string,
    groupDescription?: string
  ): Promise<ApiResponse<Chat>> {
    const chatData: CreateChatRequest = {
      participantIds,
      groupName,
      groupDescription,
      type: 'group'
    };

    return this.request<Chat>('/chat/group', {
      method: 'POST',
      body: JSON.stringify(chatData),
    });
  }

  // Message methods
  async getChatMessages(
    chatId: string,
    page = 1,
    limit = 50
  ): Promise<ApiResponse<PaginatedResponse<Message>>> {
    return this.request<PaginatedResponse<Message>>(`/chat/${chatId}/messages?page=${page}&limit=${limit}`);
  }

  // Updated sendMessage method to handle replies
  async sendMessage(
    chatId: string,
    content: string,
    files?: File[],
    replyTo?: string
  ): Promise<ApiResponse<Message>> {
    // If files are provided, use multipart form data
    if (files && files.length > 0) {
      return this.sendMessageWithFiles(chatId, content, files, replyTo);
    }

    // For text messages, use JSON
    const messageData: SendMessageRequest = {
      chatId,
      content,
      messageType: 'text',
      ...(replyTo && { replyTo })
    };

    return this.request<Message>('/chat/message', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // Separate method for handling file uploads with reply support
  private async sendMessageWithFiles(
    chatId: string,
    content: string,
    files: File[],
    replyTo?: string
  ): Promise<ApiResponse<Message>> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('content', content);
    formData.append('messageType', 'media');
    
    if (replyTo) {
      formData.append('replyTo', replyTo);
    }

    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    
    const response = await fetch(`${this.baseUrl}/api/chat/message`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        authService.logout();
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async deleteMessage(messageId: string, deleteForEveryone: boolean = false): Promise<ApiResponse<Message>> {
    return this.request<Message>(`/chat/message/${messageId}`, {
      method: 'DELETE',
      body: JSON.stringify({ deleteForEveryone }),
    });
  }

  async searchMessages(query: string, chatId?: string): Promise<ApiResponse<Message[]>> {
    const params = new URLSearchParams({ query });
    if (chatId) params.append('chatId', chatId);
    
    return this.request<Message[]>(`/chat/search?${params}`);
  }

  async markMessagesAsRead(chatId: string, messageIds: string[]): Promise<void> {
    await this.request(`/chat/${chatId}/read`, {
      method: 'POST',
      body: JSON.stringify({ messageIds }),
    });
  }

  async uploadFile(file: File, chatId: string): Promise<ApiResponse<Message>> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatId', chatId);
    
    const response = await fetch(`${this.baseUrl}/api/chat/upload`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        authService.logout();
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Notification methods
  async getNotifications(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<ChatNotification>>> {
    return this.request(`/chat/notifications?page=${page}&limit=${limit}`);
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<ChatNotification>> {
    return this.request(`/chat/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  }

  // Call methods
  async getCallHistory(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<Call>>> {
    return this.request(`/calls/history?page=${page}&limit=${limit}`);
  }

  async getActiveCalls(): Promise<ApiResponse<Call[]>> {
    return this.request('/calls/active');
  }

  async rateCall(callId: string, rating: number, feedback?: string): Promise<ApiResponse<Call>> {
    return this.request(`/calls/${callId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, feedback }),
    });
  }

  // Users/Contacts methods
  async getUsers(page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc'): Promise<ApiResponse<any>> {
    return this.request(`/auth/users?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
  }
}

export const chatService = new ChatService();