import React, { Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from '../../shared/components/Navbar';
import Footer from '../../shared/components/Footer';
import { portfolioRoutes } from './portfolioRoutes';
import ChatWidget from '../chat/ChatWidget/ChatWidget';

const PortfolioLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1 flex flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {portfolioRoutes.map(({ path, element: Element }) => (
            <Route
              key={path || 'index'}
              path={path}
              element={<Element />}
            />
          ))}
          <Route index element={React.createElement(portfolioRoutes[0].element)} />
        </Routes>
      </Suspense>
      <Outlet />
    </main>
    <Footer />
    <ChatWidget /> {/* <-- Add this line */}
  </div>
);

export default PortfolioLayout;