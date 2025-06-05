import React, { ReactNode } from 'react';

interface LazyComponentProps {
  children: ReactNode;
}

const LazyComponent: React.FC<LazyComponentProps> = ({ children }) => {
  return <>{children}</>;
};

export default LazyComponent;