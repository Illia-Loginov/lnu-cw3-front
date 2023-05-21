import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TokenService } from './services/TokenService.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TokenService>
      <App />
    </TokenService>
  </React.StrictMode>
);
