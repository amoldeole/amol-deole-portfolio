import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Eye, Trash2, Reply, Search, Filter } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { Chat } from '../../types/chat';

const ChatManagement: React.FC = () => {
  const { state, loadChats, loadNotifications, selectChat } = useChat();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'messages' | 'notifications'>('chats');
  const [hasLoaded, setHasLoaded] = useState(false);

  // Only load data once when component mounts
  useEffect(() => {
    if (!hasLoaded) {
      const loadData = async () => {
        try {
          await Promise.all([loadChats(), loadNotifications()]);
          setHasLoaded(true);
        } catch (error) {
          console.error('Failed to load chat data:', error);
        }
      };
      
      loadData();
    }
  }, [hasLoaded, loadChats, loadNotifications]);

  const filteredChats = state.chats.filter(chat => {
    const matchesSearch = chat.groupName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.participants.some(p => 
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && chat.unreadCount > 0) ||
      (filter === 'read' && chat.unreadCount === 0);
    
    return matchesSearch && matchesFilter;
  });

  const filteredNotifications = state.notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.isRead) ||
      (filter === 'read' && notification.isRead);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalChats: state.chats.length,
    unreadChats: state.chats.filter(c => c.unreadCount > 0).length,
    totalMessages: state.messages.length,
    totalNotifications: state.notifications.length,
    unreadNotifications: state.notifications.filter(n => !n.isRead).length
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleString();
  };

  const getParticipantNames = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.groupName || 'Group Chat';
    }
    return chat.participants.map(p => `${p.firstName} ${p.lastName}`).join(', ');
  };

  const handleNotificationAction = (notificationId: string, action: 'view' | 'markRead' | 'delete') => {
    const notification = state.notifications.find(n => n._id === notificationId);
    if (!notification) return;

    switch (action) {
      case 'view':
        // If notification is related to a chat, select that chat
        if (notification.relatedChat && typeof notification.relatedChat === 'object') {
          selectChat(notification.relatedChat as Chat);
          setActiveTab('messages');
        }
        break;
      case 'markRead':
        // TODO: Implement mark as read functionality
        console.log('Mark notification as read:', notificationId);
        break;
      case 'delete':
        // TODO: Implement delete notification functionality
        console.log('Delete notification:', notificationId);
        break;
    }
  };

  const handleMessageAction = (messageId: string, action: 'reply' | 'delete') => {
    const message = state.messages.find(m => m._id === messageId);
    if (!message) return;

    switch (action) {
      case 'reply':
        // TODO: Implement reply functionality in admin
        console.log('Reply to message:', messageId);
        break;
      case 'delete':
        // TODO: Implement delete message functionality
        console.log('Delete message:', messageId);
        break;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Chat Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage conversations, messages, and notifications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Chats</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalChats}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread Chats</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unreadChats}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Reply className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalMessages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Trash2 className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Notifications</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unreadNotifications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {['chats', 'messages', 'notifications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400" size={20} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {state.loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : state.error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-2">Error loading data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{state.error}</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'chats' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Chat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Participants
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Last Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Unread
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredChats.map((chat) => (
                      <motion.tr
                        key={chat._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {getParticipantNames(chat)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            chat.type === 'group' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {chat.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {chat.participants.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {chat.lastMessage ? formatTime(chat.lastMessage.createdAt) : 'No messages'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {chat.unreadCount > 0 && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              {chat.unreadCount}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => selectChat(chat)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                          >
                            View
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="p-6">
                {state.selectedChat ? (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Messages in {getParticipantNames(state.selectedChat)}
                    </h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {state.messages.map((message) => (
                        <div key={message._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {message.sender.firstName} {message.sender.lastName}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(message.createdAt)}
                              </span>
                              <button
                                onClick={() => handleMessageAction(message._id, 'reply')}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                              >
                                Reply
                              </button>
                              <button
                                onClick={() => handleMessageAction(message._id, 'delete')}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{message.content}</p>
                          {message.replyTo && (
                            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded border-l-4 border-blue-500">
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Replying to: {message.replyTo.content}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    Select a chat to view messages
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredNotifications.map((notification) => (
                      <motion.tr
                        key={notification._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            notification.type === 'message' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : notification.type === 'call'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}>
                            {notification.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {notification.body}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            notification.isRead 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {notification.isRead ? 'Read' : 'Unread'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(notification.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleNotificationAction(notification._id, 'view')}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleNotificationAction(notification._id, 'markRead')}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                          >
                            Mark Read
                          </button>
                          <button
                            onClick={() => handleNotificationAction(notification._id, 'delete')}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!state.loading && !state.error && (
          <>
            {activeTab === 'chats' && filteredChats.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No chats found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No chat conversations available.'}
                </p>
              </div>
            )}

            {activeTab === 'messages' && state.messages.length === 0 && state.selectedChat && (
              <div className="text-center py-12">
                <Reply className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No messages found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This conversation has no messages yet.
                </p>
              </div>
            )}

            {activeTab === 'notifications' && filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <Eye className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notifications found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No notifications available.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatManagement;