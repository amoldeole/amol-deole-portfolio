import React from 'react';
import { useSocket } from '../app/providers/SocketContext';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus: React.FC = () => {
  const { isConnected } = useSocket();

  if (isConnected) return null; // Only show when disconnected

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
        <WifiOff size={16} />
        <span className="text-sm">Connection lost. Trying to reconnect...</span>
      </div>
    </div>
  );
};

export default ConnectionStatus;