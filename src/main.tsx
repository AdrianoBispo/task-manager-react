import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppRouter } from './app/router';
import './styles/app.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
