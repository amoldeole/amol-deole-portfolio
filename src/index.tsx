import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/style/index.css';
import App from './app/App';
import ToastManager from './shared/components/ToastManager';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
    <ToastManager />
  </React.StrictMode>
);