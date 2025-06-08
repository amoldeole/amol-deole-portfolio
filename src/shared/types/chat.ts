export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface Chat {
  _id: string;
  type: 'individual' | 'group';
  participants: User[];
  groupName?: string;
  groupDescription?: string;
  groupAdmin?: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  chatId: string;
  sender: User;
  content?: string;
  media?: MediaFile[];
  messageType: 'text' | 'media' | 'system';
  replyTo?: {
    _id: string;
    content: string;
    sender: User;
  };
  deliveredTo?: string[];
  readBy?: string[];
  isDeleted: boolean;
  deletedFor?: string[];
  tempId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaFile {
  _id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// Fixed ChatNotification interface - single definition with consistent types
export interface ChatNotification {
  _id: string;
  user: string;
  type: 'message' | 'call' | 'system';
  title: string;
  body: string;
  data?: any;
  relatedUser?: User;
  relatedChat?: Chat;
  relatedMessage?: Message;
  relatedCall?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Fixed Call interface with consistent participant types
export interface Call {
  _id: string;
  type: 'voice' | 'video';
  initiator: User;
  participants: Array<{
    user: User;
    joinedAt?: Date;
    leftAt?: Date;
    status: 'pending' | 'joined' | 'declined' | 'left';
  }>;
  status: 'pending' | 'active' | 'ended' | 'declined';
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  chatId?: string;
  rating?: {
    user: string;
    rating: number;
    feedback?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface ChatSettings {
  notificationsEnabled: boolean;
  messagePreview: boolean;
  readReceipts: boolean;
  typingIndicators: boolean;
  lastSeen: boolean;
}

export interface CreateChatRequest {
  participantId?: string;
  participantIds?: string[];
  groupName?: string;
  groupDescription?: string;
  type: 'individual' | 'group';
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'audio' | 'video';
  replyTo?: string;
  media?: File[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items?: T[];
  chats?: T[];
  messages?: T[];
  notifications?: T[];
  users?: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}