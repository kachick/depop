import * as React from 'react'; // Import the entire React object to avoid reference issues; if omitted, the options page should be checked manually.
import { createRoot } from 'react-dom/client';
import App from './options/App.tsx';
import { assertIsDefined } from './typeguards.ts';

const root = document.getElementById('root');
assertIsDefined<HTMLElement | null>(root);

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
