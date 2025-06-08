import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Camera, 
  Type, 
  Eye,
  MoreVertical,
  Clock
} from 'lucide-react';

interface StatusItem {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: {
    type: 'text' | 'image' | 'video';
    data: string;
    backgroundColor?: string;
  };
  timestamp: Date;
  views: number;
  isViewed: boolean;
}

const Status: React.FC = () => {
  const [statuses, setStatuses] = useState<StatusItem[]>([]);
  const [myStatuses, setMyStatuses] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setMyStatuses([
        {
          id: '1',
          user: {
            id: 'me',
            name: 'My Status',
            avatar: 'ME'
          },
          content: {
            type: 'text',
            data: 'Working on something amazing! 🚀',
            backgroundColor: '#3B82F6'
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          views: 5,
          isViewed: true
        }
      ]);

      setStatuses([
        {
          id: '2',
          user: {
            id: '1',
            name: 'John Doe',
            avatar: 'JD'
          },
          content: {
            type: 'text',
            data: 'Beautiful sunset today! 🌅',
            backgroundColor: '#F59E0B'
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          views: 12,
          isViewed: false
        },
        {
          id: '3',
          user: {
            id: '2',
            name: 'Jane Smith',
            avatar: 'JS'
          },
          content: {
            type: 'text',
            data: 'Coffee time! ☕',
            backgroundColor: '#8B5CF6'
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          views: 8,
          isViewed: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const StatusItem: React.FC<{ status: StatusItem; isOwn?: boolean }> = ({ status, isOwn = false }) => (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold border-2 ${
            status.isViewed ? 'border-gray-300' : 'border-green-500'
          }`} style={{ backgroundColor: status.content.backgroundColor || '#6B7280' }}>
            {status.user.avatar}
          </div>
          {isOwn && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
              <Plus size={10} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {status.user.name}
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(status.timestamp)}
              </p>
              {isOwn && (
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <MoreVertical size={16} />
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {status.content.type === 'text' ? status.content.data : `${status.content.type} status`}
          </p>
          {isOwn && (
            <div className="flex items-center mt-1">
              <Eye size={12} className="text-gray-400 mr-1" />
              <span className="text-xs text-gray-400">{status.views} views</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Status</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Camera size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Type size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Status List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* My Status */}
            <div>
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">My Status</h3>
              </div>
              {myStatuses.length > 0 ? (
                myStatuses.map((status) => (
                  <StatusItem key={status.id} status={status} isOwn={true} />
                ))
              ) : (
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Plus size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">My Status</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tap to add status update</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Updates */}
            {statuses.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Updates</h3>
                </div>
                {statuses.map((status) => (
                  <StatusItem key={status.id} status={status} />
                ))}
              </div>
            )}

            {statuses.length === 0 && myStatuses.length === 0 && !loading && (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Clock size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No status updates</p>
                  <p className="text-sm">Share your status to let contacts know what's on your mind</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Status;