import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  UserPlus, 
  Phone, 
  Video, 
  MessageCircle, 
  Users,
  Star,
  Loader
} from 'lucide-react';
import { useChat } from '../../../app/providers/ChatContext';
import { chatService } from '../../../shared/services/chat.service';
import { User } from '../../../shared/types';
import { authService } from '../../../shared/services/auth.service';

interface ContactUser extends User {
  isBlocked?: boolean;
  isFavorite?: boolean;
  lastSeen?: Date;
}

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<ContactUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [creatingChat, setCreatingChat] = useState<string | null>(null);
  
  const { selectChat, loadChats } = useChat();
  const currentUser = authService.getUser();

  const loadContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `http://localhost:5000/api/auth/users?page=${page}&limit=10&sortBy=createdAt&sortOrder=desc`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...authService.getAuthHeaders(),
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different possible response structures
      let users: User[] = [];
      let pagination = null;

      // Try to extract users from various possible response formats
      if (data && typeof data === 'object') {
        if (data.success && data.data) {
          if (Array.isArray(data.data.users)) {
            users = data.data.users;
            pagination = data.data.pagination;
          } else if (Array.isArray(data.data)) {
            users = data.data;
          }
        } else if (Array.isArray(data.users)) {
          users = data.users;
          pagination = data.pagination;
        } else if (Array.isArray(data)) {
          users = data;
        }
      }

      // Validate that we have an array of users
      if (!Array.isArray(users)) {
        console.error('Invalid users data received:', data);
        throw new Error('Invalid response format from server');
      }

      // Filter out current user and validate user objects
      const validUsers = users.filter(user => {
        // Check if user object is valid
        if (!user || typeof user !== 'object' || !user._id) {
          console.warn('Invalid user object:', user);
          return false;
        }
        
        // Filter out current user
        return user._id !== currentUser?._id;
      });

      if (page === 1) {
        setContacts(validUsers);
      } else {
        setContacts(prev => [...prev, ...validUsers]);
      }
      
      // Set hasMore based on pagination or if we got fewer users than requested
      if (pagination && typeof pagination === 'object') {
        setHasMore(pagination.hasNext === true);
      } else {
        setHasMore(validUsers.length === 10);
      }
      
    } catch (error) {
      console.error('Failed to load contacts:', error);
      setError(error instanceof Error ? error.message : 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, [page, currentUser?._id]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleStartChat = async (contact: ContactUser) => {
    if (creatingChat === contact._id) return;
    
    try {
      setCreatingChat(contact._id);
      setError(null);
      
      // Create individual chat with the selected contact
      const response = await chatService.createIndividualChat(contact._id);
      
      if (response.success && response.data) {
        // Reload chats to get the new chat
        await loadChats();
        
        // Select the newly created chat
        selectChat(response.data);
      } else {
        throw new Error(response.message || 'Failed to create chat');
      }
    } catch (error) {
      console.error('Failed to start chat:', error);
      setError(error instanceof Error ? error.message : 'Failed to start chat');
    } finally {
      setCreatingChat(null);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (!contact || typeof contact !== 'object') return false;
    
    const firstName = String(contact.firstName || '');
    const lastName = String(contact.lastName || '');
    const email = String(contact.email || '');
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || email.toLowerCase().includes(searchLower);
  });

  const favoriteContacts = filteredContacts.filter(contact => contact.isFavorite);
  const regularContacts = filteredContacts.filter(contact => !contact.isFavorite);

  const formatLastSeen = (date: Date | string | undefined) => {
    if (!date) return 'Never';
    
    try {
      const now = new Date();
      const lastSeen = new Date(date);
      const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return lastSeen.toLocaleDateString();
    } catch (error) {
      return 'Unknown';
    }
  };

  const ContactItem: React.FC<{ contact: ContactUser }> = ({ contact }) => {
    // Validate contact data
    if (!contact || typeof contact !== 'object' || !contact._id) {
      return null;
    }

    // Safely extract and convert properties to strings
    const firstName = String(contact.firstName || 'Unknown');
    const lastName = String(contact.lastName || 'User');
    const email = String(contact.email || 'No email');
    const fullName = `${firstName} ${lastName}`;
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    return (
      <motion.div
        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {initials}
            </div>
            {contact.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            )}
            {contact.isFavorite && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star size={10} className="text-white fill-current" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {fullName}
              </p>
              <div className="flex items-center space-x-1">
                <button 
                  className="p-1 text-gray-400 hover:text-green-600 rounded transition-colors"
                  title="Voice Call"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement voice call
                  }}
                >
                  <Phone size={16} />
                </button>
                <button 
                  className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                  title="Video Call"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement video call
                  }}
                >
                  <Video size={16} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartChat(contact);
                  }}
                  disabled={creatingChat === contact._id}
                  className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors disabled:opacity-50"
                  title="Start Chat"
                >
                  {creatingChat === contact._id ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <MessageCircle size={16} />
                  )}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {email}
            </p>
            <p className="text-xs text-gray-400">
              {contact.isOnline ? 'Online' : `Last seen ${formatLastSeen(contact.lastSeen)}`}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contacts</h2>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <UserPlus size={20} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setPage(1);
              loadContacts();
            }}
            className="text-sm text-red-600 dark:text-red-400 hover:underline mt-1"
          >
            Try again
          </button>
        </div>
      )}

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {loading && page === 1 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading contacts...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Favorites */}
            {favoriteContacts.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <Star size={16} className="mr-2 text-yellow-500" />
                    Favorites ({favoriteContacts.length})
                  </h3>
                </div>
                {favoriteContacts.map((contact) => (
                  <ContactItem key={contact._id} contact={contact} />
                ))}
              </div>
            )}

            {/* All Contacts */}
            {regularContacts.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <Users size={16} className="mr-2" />
                    All Contacts ({regularContacts.length})
                  </h3>
                </div>
                {regularContacts.map((contact) => (
                  <ContactItem key={contact._id} contact={contact} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && !loading && regularContacts.length > 0 && (
              <div className="p-4">
                <button
                  onClick={handleLoadMore}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Load More Contacts
                </button>
              </div>
            )}

            {/* Loading More */}
            {loading && page > 1 && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-500">Loading more...</span>
              </div>
            )}

            {/* Empty State */}
            {filteredContacts.length === 0 && !loading && !error && (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No contacts found</p>
                  <p className="text-sm">
                    {searchTerm ? 'Try adjusting your search terms' : 'No users available to connect with'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => {
                        setPage(1);
                        loadContacts();
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Refresh contacts
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Contacts;