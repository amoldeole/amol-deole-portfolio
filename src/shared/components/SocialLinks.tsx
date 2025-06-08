import React from 'react';
import type { IconType } from 'react-icons';
import { motion } from 'framer-motion';

export interface SocialLink {
  icon: IconType;
  href: string;
  label: string;
}

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links, className = '' }) => (
  <div className={`flex flex-wrap mb-12 ${className}`}>
    {links.map(({ icon, href, label }) => {
      const IconComponent = icon as React.FC<{ size?: number }>;
      return (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.01, ease: "easeOut" }}
          className={`flex flex-wrap gradient-bg w-12 h-12 items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 text-white ${className}`}>
          <IconComponent size={24} />
        </motion.a>
      );
    })}
  </div>
);

export default SocialLinks;