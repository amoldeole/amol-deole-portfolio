import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-gray-900 dark:bg-black text-white py-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
      <div className="text-center text-gray-400 text-sm flex flex-wrap justify-center items-center gap-2">
        <span>© {new Date().getFullYear()} Amol Deole. All rights reserved.</span>
        <span className="hidden sm:inline">|</span>
        <span>Designed by Amol Deole · Built with React, TypeScript & Tailwind CSS</span>
      </div>
    </div>
  </footer>
);

export default Footer;