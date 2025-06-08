import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../app/providers/AuthContext';
import { httpClient } from '../../../../shared/utils/httpClient';
import { DashboardStats } from '../../../../shared/types/dashboard.stats.model';

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardStats = useCallback(async () => {
    if (!isAuthenticated) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await httpClient.get<{ success: boolean; data: DashboardStats }>('/api/analytics/dashboard');
      
      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error('Failed to fetch dashboard stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded">
        {error}
        <button 
          onClick={fetchDashboardStats}
          className="ml-4 text-sm underline hover:no-underline text-red-600 dark:text-red-400"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Projects */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <span className="text-2xl">💼</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Projects</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.projects.total || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats?.projects.completed || 0} completed
              </p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <span className="text-2xl">🛠️</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.skills.total || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats?.skills.featured || 0} featured
              </p>
            </div>
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <span className="text-2xl">📜</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Certificates</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.certificates.total || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats?.certificates.verified || 0} verified
              </p>
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <span className="text-2xl">📧</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contacts</h3>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats?.contacts.pending || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experience & Education */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Experience & Education</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Experience</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats?.experience.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Current Positions</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats?.experience.current || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Education Records</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats?.education.total || 0}</span>
            </div>
          </div>
        </div>

        {/* Engagement */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Engagement</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Views</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats?.engagement.totalViews || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Likes</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats?.engagement.totalLikes || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Testimonials</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats?.testimonials.total || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">➕</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Project</span>
          </button>
          <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">🏆</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Certificate</span>
          </button>
          <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">💼</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Experience</span>
          </button>
          <button className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">📧</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Contacts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;