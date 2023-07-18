/** @jsxImportSource https://esm.sh/v128/react@18.2.0 */

import React, { StrictMode } from 'https://esm.sh/v128/react@18.2.0';
import { createRoot } from 'https://esm.sh/v128/react-dom@18.2.0/client';
import App from './options/App.tsx';
import { assertIsDefined } from './typeguards.ts';

const root = document.getElementById('root');
assertIsDefined<HTMLElement | null>(root);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
