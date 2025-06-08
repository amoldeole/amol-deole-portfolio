import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  HelpCircle,
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Smartphone
} from 'lucide-react';
import { useTheme } from '../../../app/providers/ThemeContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeen, setLastSeen] = useState(true);

  const SettingItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    onClick?: () => void;
  }> = ({ icon, title, subtitle, action, onClick }) => (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
      onClick={onClick}
      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        {action || <ChevronRight size={20} className="text-gray-400" />}
      </div>
    </motion.div>
  );

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Section */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <SettingItem
            icon={<User size={20} />}
            title="Profile"
            subtitle="Update your profile information"
          />
        </div>

        {/* Appearance Section */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Appearance</h3>
          </div>
          <SettingItem
            icon={theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            title="Theme"
            subtitle={`Currently using ${theme} mode`}
            action={
              <button
                onClick={toggleTheme}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            }
          />
        </div>

        {/* Notifications Section */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</h3>
          </div>
          <SettingItem
            icon={<Bell size={20} />}
            title="Push Notifications"
            subtitle="Receive notifications for new messages"
            action={<ToggleSwitch enabled={notifications} onChange={setNotifications} />}
          />
          <SettingItem
            icon={sounds ? <Volume2 size={20} /> : <VolumeX size={20} />}
            title="Notification Sounds"
            subtitle="Play sounds for notifications"
            action={<ToggleSwitch enabled={sounds} onChange={setSounds} />}
          />
        </div>

        {/* Privacy Section */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Privacy</h3>
          </div>
          <SettingItem
            icon={readReceipts ? <Eye size={20} /> : <EyeOff size={20} />}
            title="Read Receipts"
            subtitle="Let others know when you've read their messages"
            action={<ToggleSwitch enabled={readReceipts} onChange={setReadReceipts} />}
          />
          <SettingItem
            icon={<Globe size={20} />}
            title="Last Seen"
            subtitle="Show when you were last online"
            action={<ToggleSwitch enabled={lastSeen} onChange={setLastSeen} />}
          />
          <SettingItem
            icon={<Shield size={20} />}
            title="Blocked Contacts"
            subtitle="Manage blocked users"
          />
        </div>

        {/* Chat Section */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Chat</h3>
          </div>
          <SettingItem
            icon={<Smartphone size={20} />}
            title="Chat Backup"
            subtitle="Backup and restore your chats"
          />
          <SettingItem
            icon={<Palette size={20} />}
            title="Chat Wallpaper"
            subtitle="Customize your chat background"
          />
        </div>

        {/* Help Section */}
        <div>
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Support</h3>
          </div>
          <SettingItem
            icon={<HelpCircle size={20} />}
            title="Help & Support"
            subtitle="Get help and contact support"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;