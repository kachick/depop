import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import * as React from 'https://esm.sh/react@18.3.1'; // Load whole `React` to avoid no reference, if omitting, should check options page manually
import App from './options/App.tsx';
import { assertIsDefined } from './typeguards.ts';

const root = document.getElementById('root');
assertIsDefined<HTMLElement | null>(root);

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
