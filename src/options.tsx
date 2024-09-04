import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './options/App.tsx';
import { assertIsDefined } from './typeguards.ts';

const root = document.getElementById('root');
assertIsDefined<HTMLElement | null>(root);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
