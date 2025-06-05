import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Phone, 
  Video, 
  MessageCircle, 
  Users,
  Loader,
  Shield,
  Ban,
  Eye,
  Trash2,
  X
} from 'lucide-react';
import { User } from '../../types/chat';
import { authService } from '../../services/auth.service';
import { chatService } from '../../services/chat.service';
import { useChat } from '../../contexts/ChatContext';

interface ContactUser extends User {
  isBlocked?: boolean;
  isFavorite?: boolean;
  lastSeen?: Date;
  role?: string;
  createdAt?: Date;
}

const ContactsManagement: React.FC = () => {
  const [contacts, setContacts] = useState<ContactUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [creatingChat, setCreatingChat] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'online' | 'blocked'>('all');
  const [selectedContact, setSelectedContact] = useState<ContactUser | null>(null);
  
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
      
      let users: ContactUser[] = [];
      let pagination = null;

      if (data.success && data.data) {
        if (Array.isArray(data.data.users)) {
          users = data.data.users;
          pagination = data.data.pagination;
        } else if (Array.isArray(data.data)) {
          users = data.data;
        }
      } else if (Array.isArray(data)) {
        users = data;
      } else if (data.users && Array.isArray(data.users)) {
        users = data.users;
        pagination = data.pagination;
      }

      // Filter out current user from contacts
      const filteredUsers = users.filter(user => user._id !== currentUser?._id);
      
      if (page === 1) {
        setContacts(filteredUsers);
      } else {
        setContacts(prev => [...prev, ...filteredUsers]);
      }
      
      if (pagination) {
        setHasMore(pagination.hasNext);
      } else {
        setHasMore(users.length === 10);
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

  const handleBlockUser = async (userId: string) => {
    // TODO: Implement block user functionality
    console.log('Block user:', userId);
  };

  const handleDeleteUser = async (userId: string) => {
    // TODO: Implement delete user functionality
    console.log('Delete user:', userId);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'online' && contact.isOnline) ||
      (filter === 'blocked' && contact.isBlocked);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatLastSeen = (date: Date | string) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const lastSeen = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return lastSeen.toLocaleDateString();
  };

  const stats = {
    total: contacts.length,
    online: contacts.filter(c => c.isOnline).length,
    blocked: contacts.filter(c => c.isBlocked).length,
    admins: contacts.filter(c => c.role === 'admin').length
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Contacts Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage user contacts and relationships</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
              <div className="h-3 w-3 bg-white rounded-full"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Online Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.online}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Ban className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Blocked Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.blocked}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admins</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.admins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Users</option>
            <option value="online">Online</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
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

      {/* Contacts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading && page === 1 ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredContacts.map((contact) => (
                  <motion.tr
                    key={contact._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {`${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase()}
                          </div>
                          {contact.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {`${contact.firstName} ${contact.lastName}`}
                            {contact._id === currentUser?._id && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {contact.isOnline ? 'Online' : contact.lastSeen ? `Last seen ${formatLastSeen(contact.lastSeen)}` : 'Offline'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        contact.isOnline 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : contact.isBlocked
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {contact.isOnline ? 'Online' : contact.isBlocked ? 'Blocked' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        contact.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {contact.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {contact.createdAt ? formatDate(contact.createdAt) : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStartChat(contact)}
                          disabled={creatingChat === contact._id || contact._id === currentUser?._id}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                          title="Start Chat"
                        >
                          {creatingChat === contact._id ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <MessageCircle size={16} />
                          )}
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Voice Call"
                        >
                          <Phone size={16} />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Video Call"
                        >
                          <Video size={16} />
                        </button>
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {contact._id !== currentUser?._id && (
                          <>
                            <button
                              onClick={() => handleBlockUser(contact._id)}
                              className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                              title="Block User"
                            >
                              <Ban size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(contact._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More Users
            </button>
          </div>
        )}

        {/* Loading More */}
        {loading && page > 1 && (
          <div className="flex items-center justify-center p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-500">Loading more...</span>
          </div>
        )}

        {/* Empty State */}
        {filteredContacts.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No users found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms.' : 'No users available.'}
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Details</h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {`${selectedContact.firstName.charAt(0)}${selectedContact.lastName.charAt(0)}`.toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {`${selectedContact.firstName} ${selectedContact.lastName}`}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedContact.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedContact.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Role:</span>
                  <p className="text-gray-600 dark:text-gray-400">{selectedContact.role || 'user'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Joined:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedContact.createdAt ? formatDate(selectedContact.createdAt) : 'Unknown'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Last Seen:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedContact.isOnline ? 'Online now' : 
                     selectedContact.lastSeen ? formatLastSeen(selectedContact.lastSeen) : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsManagement;